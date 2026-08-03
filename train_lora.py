#!/usr/bin/env python3
"""
=============================================================================
 Civil Sahai: LoRA / QLoRA Fine-Tuning Pipeline for Google Gemma 2 (2B-IT)
 Multilingual Clinical Intake & Emergency Handover JSON Synthesizer
=============================================================================
"""

import os
import sys
import json
import argparse
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    PeftModel,
)
from trl import SFTTrainer

# ==================== SYSTEM PROMPTS ====================
GEMMA_INTAKE_SYSTEM_PROMPT = """You are a specialized multilingual clinical intake assistant powered by Google Gemma for Civil Hospital OPD.
Convert patient descriptions in Gujarati, Hindi, English, or mixed languages into structured clinical intake data.

SAFETY RULES:
1. NEVER provide medical diagnosis.
2. NEVER suggest medicines or dosages.
3. Extract only facts directly stated by the patient.

Output STRICTLY JSON with this schema:
{
  "language_detected": "Gujarati | Hindi | English | Mixed",
  "chief_complaint": "Brief primary reason for visit in English",
  "symptoms": ["list of reported symptoms translated to clinical English"],
  "duration": "Duration of symptoms",
  "age": "Patient age or Not specified",
  "gender": "Patient gender or Not specified",
  "existing_conditions": ["Chronic conditions or None reported"],
  "current_medicines": ["Current medications or None reported"],
  "allergies": "Reported allergies or Not specified",
  "missing_details": ["List missing fields that staff should ask"],
  "emergency_indicators": ["Emergency red flags or None detected"],
  "doctor_summary": "Concise objective 2-3 sentence summary for the doctor without any diagnosis."
}"""

GEMMA_TRANSFER_SYSTEM_PROMPT = """You are an emergency inter-hospital handover specialist powered by Google Gemma for Civil Hospital Emergency Trauma Center.
Convert patient transfer notes or referral chits from rural PHCs/CHCs into a structured Emergency Transfer Handover Packet.

SAFETY RULES:
1. NO medical diagnosis or prescription.
2. Capture referral details, pre-transfer interventions, and transit events accurately.
3. Identify CRITICAL HANDOVER GAPS (vital facts city emergency doctors frequently miss).

Output STRICTLY JSON with this schema:
{
  "language_detected": "Gujarati | Hindi | English | Mixed",
  "patient_name": "Patient name or Unknown",
  "age_gender": "Age and Gender",
  "referring_facility": "Name of village PHC/CHC",
  "receiving_facility": "Civil Hospital Emergency Trauma Center",
  "transfer_reason": "Clinical justification for referral",
  "chief_condition_at_referral": "Primary acute condition",
  "symptoms": ["Key symptoms"],
  "pre_transfer_treatments": ["List of medications/injections/fluids given before transfer"],
  "transit_events": ["Events during transit or Stable in transit"],
  "allergies": "Known allergies or Unverified",
  "critical_handover_gaps": ["Crucial missing transfer details"],
  "emergency_red_flags": ["Immediate life-threat alerts"],
  "doctor_handover_summary": "3-4 sentence SBAR summary for receiving doctor."
}"""


def format_chat_prompt(item):
    """Formats each dataset entry into Gemma 2's official chat template."""
    is_transfer = item.get("instruction_type") == "rural_transfer"
    sys_prompt = GEMMA_TRANSFER_SYSTEM_PROMPT if is_transfer else GEMMA_INTAKE_SYSTEM_PROMPT
    input_label = "Referral Chit:" if is_transfer else "Patient Input:"

    target_json_str = (
        json.dumps(item["output"], indent=2, ensure_ascii=False)
        if isinstance(item["output"], dict)
        else str(item["output"])
    )

    formatted_text = (
        f"<start_of_turn>user\n"
        f"{sys_prompt}\n\n"
        f"{input_label}\n\"\"\"\n{item['input']}\n\"\"\"\n\n"
        f"JSON Output:<end_of_turn>\n"
        f"<start_of_turn>model\n"
        f"{target_json_str}<end_of_turn>"
    )
    return {"text": formatted_text}


def load_clinical_dataset(dataset_path):
    """Loads and formats the clinical JSON dataset for training."""
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at: {dataset_path}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"✓ Loaded {len(data)} clinical training samples from {dataset_path}")
    raw_dataset = Dataset.from_list(data)
    formatted_dataset = raw_dataset.map(format_chat_prompt)
    return formatted_dataset


def run_training(args):
    """Main QLoRA fine-tuning execution."""
    print("=" * 70)
    print("🏥 CIVIL SAHAI — GEMMA 2 (2B) QLoRA FINE-TUNING PIPELINE")
    print(f"Base Model: {args.model_id}")
    print(f"Dataset Path: {args.dataset_path}")
    print(f"Output Directory: {args.output_dir}")
    print("=" * 70)

    # 1. 4-bit Quantization Configuration (QLoRA)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16 if not torch.cuda.is_bf16_supported() else torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )

    # 2. Tokenizer Loading
    print(f"\n[1/5] Loading Tokenizer for {args.model_id}...")
    tokenizer = AutoTokenizer.from_pretrained(args.model_id, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # 3. Base Model Loading in 4-bit
    print(f"[2/5] Loading Gemma 2 Base Model in 4-bit NF4...")
    device_map = "auto" if torch.cuda.is_available() else None
    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        quantization_config=bnb_config if torch.cuda.is_available() else None,
        device_map=device_map,
        trust_remote_code=True,
    )

    if torch.cuda.is_available():
        model = prepare_model_for_kbit_training(model)
        model.config.use_cache = False

    # 4. LoRA Adapter Configuration
    print(f"[3/5] Setting up LoRA (r={args.lora_r}, alpha={args.lora_alpha})...")
    lora_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_dropout=args.lora_dropout,
        bias="none",
        task_type="CAUSAL_LM",
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # 5. Load Dataset
    print(f"\n[4/5] Preparing Dataset...")
    dataset = load_clinical_dataset(args.dataset_path)

    # 6. SFT Training Arguments
    use_bf16 = torch.cuda.is_available() and torch.cuda.is_bf16_supported()
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        optim="paged_adamw_8bit" if torch.cuda.is_available() else "adamw_torch",
        logging_steps=2,
        learning_rate=args.learning_rate,
        weight_decay=0.01,
        fp16=not use_bf16 and torch.cuda.is_available(),
        bf16=use_bf16,
        max_grad_norm=0.3,
        warmup_ratio=0.05,
        lr_scheduler_type="cosine",
        save_strategy="epoch",
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=lora_config,
        dataset_text_field="text",
        max_seq_length=args.max_seq_length,
        tokenizer=tokenizer,
        args=training_args,
    )

    # 7. Start Training
    print(f"\n[5/5] Starting LoRA Fine-Tuning for {args.epochs} Epochs...")
    trainer.train()

    # 8. Save LoRA Adapters
    final_adapter_dir = os.path.join(args.output_dir, "final_adapter")
    print(f"\n✓ Training Complete! Saving LoRA Adapters to: {final_adapter_dir}")
    trainer.model.save_pretrained(final_adapter_dir)
    tokenizer.save_pretrained(final_adapter_dir)

    # 9. Verification Inference on Sample Test Case
    print("\n" + "=" * 70)
    print("🩺 RUNNING POST-TRAINING CLINICAL INFERENCE TEST")
    print("=" * 70)

    test_input = "Mane 2 divas thi chhati ma daban ane dukhava che. BP ni goli chalu che. Umar 52 che."
    prompt = (
        f"<start_of_turn>user\n"
        f"{GEMMA_INTAKE_SYSTEM_PROMPT}\n\n"
        f"Patient Input:\n\"\"\"\n{test_input}\n\"\"\"\n\n"
        f"JSON Output:<end_of_turn>\n"
        f"<start_of_turn>model\n"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=450, temperature=0.1)

    generated_output = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    print("\nGenerated Structured Clinical Output:")
    print(generated_output)
    print("=" * 70)

    # 10. Optional: Merge LoRA with Base Model
    if args.merge_and_save:
        merge_dir = os.path.join(args.output_dir, "merged_full_model")
        print(f"\nMerging LoRA weights into base model -> {merge_dir}...")
        base_model_reload = AutoModelForCausalLM.from_pretrained(
            args.model_id,
            torch_dtype=torch.float16,
            device_map="cpu",
            trust_remote_code=True,
        )
        merged_model = PeftModel.from_pretrained(base_model_reload, final_adapter_dir)
        merged_model = merged_model.merge_and_unload()
        merged_model.save_pretrained(merge_dir)
        tokenizer.save_pretrained(merge_dir)
        print(f"✓ Full merged model saved to {merge_dir} (Ready for GGUF/Ollama conversion)!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune Gemma 2 (2B) for Civil Sahai Multilingual Clinical Intake")
    parser.add_argument("--model_id", type=str, default="google/gemma-2-2b-it", help="Hugging Face model ID")
    parser.add_argument("--dataset_path", type=str, default="dataset/clinical_intake_dataset.json", help="Path to clinical JSON dataset")
    parser.add_argument("--output_dir", type=str, default="./civil_sahai_gemma2_lora", help="Output directory for checkpoints")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=2, help="Per device train batch size")
    parser.add_argument("--grad_accum", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--learning_rate", type=float, default=2e-4, help="Peak learning rate")
    parser.add_argument("--lora_r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora_alpha", type=int, default=32, help="LoRA alpha scaling")
    parser.add_argument("--lora_dropout", type=float, default=0.05, help="LoRA dropout rate")
    parser.add_argument("--max_seq_length", type=int, default=1024, help="Maximum sequence length")
    parser.add_argument("--merge_and_save", action="store_true", help="Merge LoRA with base model for deployment")

    args = parser.parse_args()
    run_training(args)
