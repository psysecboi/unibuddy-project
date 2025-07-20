import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function StudentDashboard() {
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [profQuestion, setProfQuestion] = useState("");
  const [allDoubts, setAllDoubts] = useState([]);

  const fetchDoubts = async () => {
    const snapshot = await getDocs(collection(db, "doubts"));
    setAllDoubts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchDoubts(); }, []);

  const askAI = async () => {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: `Course: ${course}\nTopic: ${topic}\nQuestion: ${question}` }]
            }
          ]
        }
      );
      setAiAnswer(res.data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error(err);
      setAiAnswer("Error fetching answer from AI. Please try again later.");
    }
  };

  const askProf = async () => {
    try {
      await addDoc(collection(db, "doubts"), {
        course_name: course,
        topic_name: topic,
        question: profQuestion,
        answer: "",
        asked_by: "anonymous",
        timestamp: new Date(),
      });
      setProfQuestion("");
      alert("Your question has been sent anonymously!");
      fetchDoubts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Ask AI</h3>
      <input placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
      <input placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <textarea placeholder="Your Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={askAI}>Ask AI</button>
      <p>{aiAnswer}</p>

      <h3>Ask Professor (Anonymously)</h3>
      <textarea placeholder="Your Question" value={profQuestion} onChange={(e) => setProfQuestion(e.target.value)} />
      <button onClick={askProf}>Send</button>

      <h3>All Doubts & Answers</h3>
      {allDoubts.map(d => (
        <div key={d.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p><b>{d.course_name} - {d.topic_name}</b></p>
          <p>{d.question}</p>
          <p><i>Answer: {d.answer || "Not answered yet"}</i></p>
        </div>
      ))}
    </div>
  );
}
