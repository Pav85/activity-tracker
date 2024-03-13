import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc, addDoc } from "firebase/firestore";
import "./App.css";

const App = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState("selectCategory");

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const loadedCategories = [];
      querySnapshot.forEach((doc) => {
        loadedCategories.push(doc.id);
      });
      setCategories(loadedCategories);
    };

    const savedCategory = localStorage.getItem("selectedCategory");
    const savedPage = localStorage.getItem("currentPage");

    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
    if (savedPage) {
      setCurrentPage(savedPage);
    } else {
      setCurrentPage("selectCategory");
    }

    fetchCategories();
  }, []);

  const handleCategorySelection = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage("addActivity");
    localStorage.setItem("selectedCategory", cat);
    localStorage.setItem("currentPage", "addActivity");
  };

  const handleCategoryCreation = async (e) => {
    e.preventDefault();
    if (category && !categories.includes(category)) {
      const newCategoryName = category.trim().toLowerCase();
      await setDoc(doc(db, "categories", newCategoryName), {
        initialized: true,
      });
      setCategories([...categories, newCategoryName]);
      setCategory("");
    }
  };

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

  const handleGoBack = () => {
    setCurrentPage("selectCategory");
    localStorage.setItem("currentPage", "selectCategory");
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="App">
      <h1>Activity Tracker</h1>
      <hr></hr>
      {currentPage === "selectCategory" ? (
        <React.Fragment>
          <h2>Choose existing or create a new category</h2>
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
              <button
                key={index}
                onClick={() => handleCategorySelection(cat)}
                className="category-button"
              >
                {capitalize(cat)}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2>Adding Activity for: {capitalize(selectedCategory)}</h2>
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
          <button onClick={handleGoBack} className="go-back-button">
            Back
          </button>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
