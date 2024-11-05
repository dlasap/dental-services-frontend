import React from "react";
import { getFormattedDate, getFormattedTime } from "../lib/utils";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";

export const BookingConfirmation = ({
  service = "",
  dentist,
  appointedDate = "",
  appointedTime = "",
  notesHandler,
  notes = "",
  confirmAppointmentClick,
}) => {
  const stringifiedDate = appointedDate ? getFormattedDate(appointedDate) : "";
  const stringifiedTime = appointedTime ? getFormattedTime(appointedTime) : "";
  return (
    <div className="max-w-[100vw] lg:max-w-[700px] min-h-[300px] flex flex-col gap-4 ">
      <div>
        <h3 className="bg-primary font-bold text-3xl py-2 text-white">
          APPOINTMENT DETAILS
        </h3>
      </div>
      <div className="flex flex-col gap-2 items-center pb-2">
        <h4 className="text-2xl">
          <span className="text-primary font-bold ">Great Job!&nbsp;</span>
          Kindly confirm all the details below.
        </h4>
        <FontAwesomeIcon
          className="mt-[2rem]"
          size={"3x"}
          icon={faCalendarCheck}
        />
        <div className="mt-[1rem]">
          <span className="text-xl">
            <span className="text-primary font-bold">{service}</span>{" "}
            appointment with{" "}
            <span className="text-primary font-bold">
              {dentist?.fullName ?? ""}
            </span>
          </span>
        </div>
        <div className="p-4 max-w-[90%]">
          <span className="text-xl">
            Appointment will start on{" "}
            <span className="text-primary font-bold">{stringifiedTime} </span> -{" "}
            <span className="text-primary font-bold">{stringifiedDate}</span> ,
            please be there atleast 15 minutes before your appointment time.
          </span>
        </div>
        <div className="flex flex-col max-w-[300px] justify-center items-center p-4">
          <label>Any notes you would like to add:</label>
          <textarea
            className="bg-white border border-solid border-secondary px-2 py-1 rounded-md text-lg text-primary mt-2"
            onChange={notesHandler}
            value={notes}
          />
        </div>

        <div>
          <Button
            className="text-white hover:bg-secondary"
            onClick={confirmAppointmentClick}
          >
            Confirm Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};
