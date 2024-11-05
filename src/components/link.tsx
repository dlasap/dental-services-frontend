import React from "react";
import { Link } from "react-router-dom";

export const LinkTo = ({ children, to, onClick }) => {
  return (
    <Link
      to={to}
      className="flex gap-2 justify-center items-center text-white hover:text-secondary"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
