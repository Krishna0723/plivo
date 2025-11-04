import React, { useState } from "react";
import axios from "axios";
// import n8nLink from "./config"; --- IGNORE ---

export default function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    setLoading(true);
    try {
      console.log("Sending request to n8n workflow...");
      const payload = { text: text.trim(), mode };
      const resp = await axios.post(process.env.REACT_APP_n8nLink, payload, {
        timeout: 20000,
      });
      if (resp?.data) {
        let modifyData;
        if (resp.data.analysis.includes("**")) {
          modifyData = resp.data.analysis.replace(/\*\*/g, "");
        }
        setResult(modifyData || resp.data.analysis);
      } else setError("No response from workflow");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      style={{
        fontFamily: "Inter,Arial,Helvetica,sans-serif",
        maxWidth: 760,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1 style={{ marginBottom: 6 }}>n8n + LLM — Text Analyzer</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Enter a short paragraph and choose <strong>Summary</strong> or{" "}
        <strong>Sentiment</strong>.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "block" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a short paragraph "
            rows={6}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="radio"
              checked={mode === "summary"}
              onChange={() => setMode("summary")}
            />{" "}
            Summary
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="radio"
              checked={mode === "sentiment"}
              onChange={() => setMode("sentiment")}
            />{" "}
            Sentiment
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Analyze
          </button>
        </div>
      </form>

      <div style={{ marginTop: 18 }}>
        {loading && <div>Processing…</div>}
        {error && (
          <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
            {String(error)}
          </div>
        )}
        {result && (
          <div
            style={{
              marginTop: 10,
              padding: 12,
              background: "#f7f7fb",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Result</h3>
            <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: 22, color: "#666", fontSize: 13 }}>
        <div>copyright © 2024 Purna Sai Krishna</div>
      </footer>
    </div>
  );
}
