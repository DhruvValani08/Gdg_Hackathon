import React from 'react';

export default function GuideView() {
  return (
    <div className="glass-panel info-view-panel">
      <h2>📖 Beginner's Guide: Ollama, Gemma & Kaggle</h2>
      <p className="panel-desc">
        Everything you need to understand how local Gemma models run on your machine and how to submit your project to the Kaggle Hackathon.
      </p>

      <div className="guide-steps">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-body">
            <h3>Install Ollama (Local Model Runner)</h3>
            <p>Ollama lets you run models like Gemma directly on your computer without paying for API keys.</p>
            <ol>
              <li>Download Ollama from <a href="https://ollama.com/download" target="_blank" rel="noreferrer">ollama.com</a>.</li>
              <li>Install and open your terminal (PowerShell / Command Prompt).</li>
              <li>Verify by running: <code>ollama --version</code></li>
            </ol>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-body">
            <h3>Download and Run Gemma</h3>
            <p>Pull Google's Gemma model with a single command:</p>
            <div className="code-snippet">
              <code>ollama run gemma:2b</code>
            </div>
            <p className="small-note">
              Once downloaded, Ollama exposes a local REST API at <code>http://localhost:11434/api/generate</code>. This web app automatically detects and talks to it!
            </p>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-body">
            <h3>Kaggle Hackathon Submission Checklist</h3>
            <p>To submit your project successfully to the Kaggle competition:</p>
            <ul>
              <li><strong>Kaggle Writeup:</strong> Max 1,500 words describing your architecture, safety guardrails, and problem statement.</li>
              <li><strong>Public Code Repository:</strong> Push your code to GitHub and attach the link.</li>
              <li><strong>Live Demo / Notebook:</strong> Provide a link to your running demo or a reproducible Kaggle notebook.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
