import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import CategorySelection from "./components/CategorySelection";
import AddActivity from "./components/AddActivity";
import CategoryActivities from "./components/CategoryActivities";
import "./App.css";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState("selectCategory");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const loadedCategories = querySnapshot.docs.map((doc) => doc.id);
        setCategories(loadedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelection = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage("addActivity");
  };

  const handleCategoryCreation = async (category) => {
    if (!categories.includes(category)) {
      const newCategoryName = category.trim().toLowerCase();
      try {
        await setDoc(doc(db, "categories", newCategoryName), {
          initialized: true,
        });
        setCategories([...categories, newCategoryName]);
      } catch (error) {
        console.error("Error adding new category:", error);
      }
    } else {
      alert("Category already exists!");
    }
  };

  return (
    <div className="App">
      <h1>Activity Tracker</h1>
      <hr />
      {currentPage === "selectCategory" ? (
        <CategorySelection
          categories={categories}
          onCategorySelect={handleCategorySelection}
          onCategoryCreate={handleCategoryCreation}
        />
      ) : (
        <>
          <AddActivity
            selectedCategory={selectedCategory}
            onGoBack={() => setCurrentPage("selectCategory")}
          />
          <CategoryActivities selectedCategory={selectedCategory} />
        </>
      )}
    </div>
  );
};

export default App;
