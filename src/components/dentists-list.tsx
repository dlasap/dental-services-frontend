import React from "react";
import { cn } from "../lib/utils";

const DentistProfile = ({ dentist, selected = false, onClick }) => {
  return (
    <div
      key={dentist.name}
      className={cn(
        "border border-solid border-secondary rounded-md hover:cursor-pointer hover:bg-primary hover:text-white",
        selected && "text-white bg-secondary"
      )}
      onClick={() => onClick(dentist)}
    >
      <h4>{dentist.fullName}</h4>
    </div>
  );
};

export const DentistsList = ({
  dentists = [],
  showList = false,
  onDentistClick,
  selectedDentist,
}: {
  dentists: Record<string, any>[];
  showList?: boolean;
  onDentistClick: (dentist: Record<string, any>) => void;
  selectedDentist: Record<string, any>;
}) => {
  return (
    <div className="bg-white rounded-md h-fit pb-1">
      <h3 className="bg-primary font-bold text-xl py-2 px-4 text-white">
        Choose your Dentist
      </h3>

      {dentists.length > 0 && showList ? (
        <div className="flex flex-col gap-4 p-4">
          {dentists.map((dentist) => {
            return (
              <DentistProfile
                dentist={dentist}
                selected={selectedDentist?.dentistId === dentist?.dentistId}
                onClick={onDentistClick}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center font-semibold mt-2 mb-1">
          Select a service first
        </p>
      )}
    </div>
  );
};
