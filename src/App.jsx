import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import "./App.css";

const App = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryCreation = async (e) => {
    e.preventDefault();
    if (category && !categories.includes(category)) {
      const newCategoryName = category.trim().toLowerCase();
      await setDoc(doc(db, newCategoryName, "placeholder"), {
        initialized: true,
      });
      setCategories([...categories, category]);
      setCategory("");
    }
  };

  const handleCategorySelection = (cat) => {
    setSelectedCategory(cat);
    setIsCategorySelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, selectedCategory), {
        date: date,
        subject: subject,
        hours: hours,
      });
      console.log("Document written with ID: ", docRef.id);

      setDate("");
      setSubject("");
      setHours("");
      setIsCategorySelected(false);
      setSelectedCategory("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Track Your Activities</h1>
      {!isCategorySelected ? (
        <div>
          <form onSubmit={handleCategoryCreation}>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
              required
            />
            <button type="submit">Create</button>
          </form>
          <div>
            {categories.map((cat, index) => (
              <button key={index} onClick={() => handleCategorySelection(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default App;
