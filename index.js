import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  const handleQuery = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/chat", { query });
      setResponse(res.data.response);
      setHistory([...history, { query, response: res.data.response }]);
    } catch (error) {
      console.error("Error fetching data", error);
      setResponse("Error processing your request. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>AI-Powered Chatbot</h1>
      <div className="chatbox">
        <input
          type="text"
          placeholder="Enter your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleQuery}>Submit</button>
      </div>
      <div className="response">
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
      <div className="history">
        <h3>Query History:</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>Query:</strong> {item.query} <br />
              <strong>Response:</strong> {item.response}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}