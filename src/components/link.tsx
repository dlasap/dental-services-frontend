import { cn } from "../lib/utils";
import React from "react";
import { Link } from "react-router-dom";

export const LinkTo = ({ children, to, onClick, className }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex gap-2 justify-center items-center text-white hover:text-secondary",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
