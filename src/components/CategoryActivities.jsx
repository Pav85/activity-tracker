import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
    <div>
      <h2>Activities in "{selectedCategory}"</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.date} - {activity.subject} - {activity.hours}
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
