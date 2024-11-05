import { useContext } from "react";
import { DentalInfoContext } from "./dentalInfoContext";

export const useDentalinfo = () => {
  const context = useContext(DentalInfoContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
