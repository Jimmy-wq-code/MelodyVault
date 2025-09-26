import React from "react";

const FilterDropdown = ({ options, selected, onChange, label = "Filter:" }) => {
  return (
    <label>
      {label}{" "}
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
};

export default FilterDropdown;
