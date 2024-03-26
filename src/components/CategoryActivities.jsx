import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../App.css";
const CategoryActivities = ({ selectedCategory }) => {
  const [activities, setActivities] = useState([]);

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
        const loadedActivities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(loadedActivities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    if (selectedCategory) {
      fetchActivities();
    }
  }, [selectedCategory]);

  return (
    <div className="activities-list">
      <h2>Activities in "{selectedCategory}"</h2>
      {/* i want to have a bar that shows date activity and time and i will be able to sort my recorded activities by date time and description. Also i want the activities to be displayed by date by default */}
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
