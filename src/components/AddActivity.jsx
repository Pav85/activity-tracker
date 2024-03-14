import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PropTypes from "prop-types";

const AddActivity = ({ selectedCategory, onGoBack }) => {
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1000);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
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

      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Activity was successfully added</p>
            <span
              className="close-button"
              onClick={() => setShowSuccessModal(false)}
            >
              &times;
            </span>
          </div>
        </div>
      )}
    </>
  );
};
AddActivity.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default AddActivity;
