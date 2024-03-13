import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddActivity = ({ selectedCategory, onGoBack }) => {
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activitiesRef = collection(
        db,
        "categories",
        selectedCategory,
        "activities"
      );
      const docRef = await addDoc(activitiesRef, {
        date: date,
        subject: subject,
        hours: hours,
      });
      console.log("Document written with ID: ", docRef.id);

      setDate("");
      setSubject("");
      setHours("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <React.Fragment>
      <h2>
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h2>
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
      <button onClick={onGoBack} className="go-back-button">
        Back
      </button>
    </React.Fragment>
  );
};

export default AddActivity;
