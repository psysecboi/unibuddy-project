
import React, { useEffect, useState } from "react";
import axios from "axios";
import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function ProfessorDashboard() {
  const [methodInput, setMethodInput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    const fetchDoubts = async () => {
      const snapshot = await getDocs(collection(db, "doubts"));
      setDoubts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDoubts();
  }, []);

  const getTeachingMethods = async () => {
    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyCB3piyf3tuYuDeV66aIQjTvgjIfZlPjls",
        {
          contents: [
            {
              role: "user",
              parts: [
                { text: `Suggest effective teaching methods for: ${methodInput}` }
              ]
            }
          ]
        }
      );
      setAiSuggestions(res.data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Gemini API Error:", err.response ? err.response.data : err.message);
      setAiSuggestions("Error fetching suggestions.");
    }
  };

  const answerDoubt = async (id) => {
    const answer = prompt("Enter your answer:");
    if (answer) {
      await updateDoc(doc(db, "doubts", id), { answer });
      alert("Answer sent!");
    }
  };

  return (
    <div>
      <h2>Professor Dashboard</h2>
      <h3>AI Teaching Assistant</h3>
      <input placeholder="Topic or Difficulty Area" value={methodInput} onChange={(e) => setMethodInput(e.target.value)} />
      <button onClick={getTeachingMethods}>Get Suggestions</button>
      <p>{aiSuggestions}</p>

      <h3>Student Doubts</h3>
      {doubts.map(d => (
        <div key={d.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <p><b>{d.course_name} - {d.topic_name}</b></p>
          <p>{d.question}</p>
          <p><i>Answer: {d.answer || "Not answered yet"}</i></p>
          {!d.answer && <button onClick={() => answerDoubt(d.id)}>Answer</button>}
        </div>
      ))}
    </div>
  );
}
