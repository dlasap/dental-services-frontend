import React from "react";

export const Button = ({ label = "", onClick, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className="text-white rounded-sm bg-secondary p-0 m-0 px-4 py-1 border-none hover:bg-tertiary"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
