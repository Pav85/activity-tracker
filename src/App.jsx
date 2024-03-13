import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

const App = () => {
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "activities"), {
        date: date,
        subject: subject,
        hours: hours,
      });
      console.log("Document written with ID: ", docRef.id);

      setDate("");
      setSubject("");
      setHours("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <React.Fragment>
      <div className="App">
        <h1>Activity Tracker</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            value={subject}
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            type="number"
            value={hours}
            placeholder="Hours"
            onChange={(e) => setHours(e.target.value)}
            required
            min="1"
            step="1"
          />
          <button type="submit">Add Activity</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default App;
