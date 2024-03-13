import React, { useState } from "react";

const CategorySelection = ({
  categories,
  onCategorySelect,
  onCategoryCreate,
}) => {
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCategoryCreate(category);
    setCategory("");
  };

  return (
    <>
      <h2>Choose an existing or create a new category</h2>
      <form onSubmit={handleSubmit}>
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
            onClick={() => onCategorySelect(cat)}
            className="category-button"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategorySelection;
