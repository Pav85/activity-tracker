import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../App.css";

const CategoryActivities = ({ selectedCategory }) => {
  const [activities, setActivities] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesCollectionRef = collection(
          db,
          "categories",
          selectedCategory,
          "activities"
        );
        const querySnapshot = await getDocs(activitiesCollectionRef);
        let loadedActivities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        loadedActivities = loadedActivities.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.date > b.date ? 1 : -1;
          } else {
            return a.date < b.date ? 1 : -1;
          }
        });

        setActivities(loadedActivities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    if (selectedCategory) {
      fetchActivities();
    }
  }, [selectedCategory, sortOrder]);

  return (
    <div className="activities-list">
      <div className="sort">
        <button onClick={toggleSortOrder}>
          Sort {sortOrder === "asc" ? "↓" : "↑"}
        </button>
        <h2>Activities in "{selectedCategory}"</h2>
      </div>

      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className="activity-item">
              <span className="activity-date">{activity.date}</span>
              <span className="activity-subject">{activity.subject}</span>
              <span className="activity-hours">{activity.hours} hrs</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found in this category.</p>
      )}
    </div>
  );
};

export default CategoryActivities;
