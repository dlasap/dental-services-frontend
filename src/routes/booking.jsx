import { useAuth } from "../hooks/useAuthContext";
import { Calendar } from "../components/ui/calendar";
import {
  DAYS_OF_WEEK,
  DEFAULT_APPOINTMENT_TIMES,
  DENTAL_SERVICES,
} from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn, isSameDate } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useDentalinfo } from "../hooks/useDentalInfo";
import { DentistsList } from "../components/dentists-list";
import { BookingConfirmation } from "../components/booking-confirmation";
import { DentalDialog } from "../components/dental-dialog";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import LoadingSpinner from "../components/ui/loading-spinner";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";

export default function Booking() {
  const { user } = useAuth();
  const { createAppointment } = useApi();
  const { dentistsData, appointmentsData, refecthAppointments } =
    useDentalinfo();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(null);
  const [notes, setNotes] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [openConfirmaitonDialog, setOpenConfirmationDialog] = useState(false);

  const {
    mutate: createAppointmentMutation,
    isPending: isCreateAppointmentPending,
    isSuccess: createAppointmentSuccess,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {},
    onError: () => {},
  });

  const dentists = useMemo(() => {
    return dentistsData?.data?.data.length > 0 ? dentistsData?.data?.data : [];
  }, [dentistsData]);

  const appointments = useMemo(() => {
    return appointmentsData?.data?.data.length > 0
      ? appointmentsData?.data?.data
      : [];
  }, [appointmentsData]);

  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist) => {
      if (selectedService)
        return dentist.specialization.includes(selectedService);
      return false;
    });
  }, [dentists, selectedService]);

  const disabledDaysForCalendar = useMemo(() => {
    if (selectedDoctor) {
      const availableDaysIndices = selectedDoctor.availableDays.map((day) =>
        DAYS_OF_WEEK.indexOf(day)
      );

      const disabledDays = Array.from({ length: 7 }, (_, i) => i).filter(
        (val) => !availableDaysIndices.includes(val)
      );

      return disabledDays;
    }
    return [];
  }, [selectedDoctor]);

  const takenDentistTimes = useMemo(() => {
    if (selectedDate && selectedDoctor && appointments.length > 0) {
      const docAppointments = appointments.filter((apt) => apt.dentistId === selectedDoctor.dentistId);

      const docAppointmentsPossibleDay = docAppointments.filter((apt) => {
        return isSameDate(new Date(selectedDate), new Date(apt.appointmentDate));
      });

      const takenDates = docAppointmentsPossibleDay.map((apt) => apt?.appointmentTime);

      return takenDates;
    }
    return [];
  }, [selectedDoctor, selectedDate, appointments]);

  const timeIsWithinDoctorHours = useCallback(
    (startTime, endTime) => {
      if (selectedDoctor) {
        const endTimeInNumber = Number(endTime.replace(":", ""));
        const startTimeInNumber = Number(startTime.replace(":", ""));

        const endTimeDoctor = Number(selectedDoctor.officeHours?.end.replace(":", ""));
        const startTimeDoctor = Number(selectedDoctor.officeHours?.start.replace(":", ""));

        return startTimeInNumber >= startTimeDoctor && endTimeInNumber <= endTimeDoctor;
      }

      return false;
    },
    [selectedDoctor]
  );

  const handleDentistClick = (dentist) => {
    setSelectedDoctor(dentist);
  };

  const handleCreateAppointment = () => {
    const params = {
      userId: user.userId,
      dentistId: selectedDoctor.dentistId,
      appointmentDate: new Date(selectedDate).toISOString(),
      appointmentTime: selectedScheduleTime,
      status: "Scheduled",
      service: selectedService,
      notes: notes,
    };
    createAppointmentMutation(params);
    setOpenConfirmationDialog(true);
  };

  useEffect(() => {
    setSelectedDoctor(null);
    setSelectedScheduleTime(null);
    setSelectedDate(null);
    setSelectedScheduleTime(null);
  }, [selectedService]);

  useEffect(() => {
    setSelectedDate(null);
    setSelectedScheduleTime(null);
    refecthAppointments();
  }, [selectedDoctor]);

  useEffect(() => {
    setSelectedScheduleTime(null);
  }, [selectedDate]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div className="w-full flex justify-evenly flex-wrap lg:pr-12 pr-2 lg:m-8 m-2">
      <div className="py-4 overflow-hidden">
        <div className="py-3 flex gap-4 flex-wrap">
          <h3 className="font-bold text-4xl capitalize">
            {" "}
            <span className="text-white capitalize">Hello!</span>
            &nbsp;{user.firstName}
          </h3>

          <div className="bg-primary p-6 rounded-lg text-white flex flex-col gap-6 md:flex-row md:gap-12">
            <label className="font-semibold text-lg">To book an appointment:</label>
            <div className="flex flex-col space-y-2 md:text-left">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className={cn("text-white text-left", selectedService && "text-green-400")} />
                <span className={cn("text-white text-left", selectedService && "text-green-400")}>Choose a Service</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className={cn("text-white text-left", selectedDoctor && "text-green-400")} />
                <span className={cn("text-white text-left", selectedDoctor && "text-green-400")}>Choose your preferred Dentist</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className={cn("text-white text-left", selectedScheduleTime && selectedDate && "text-green-400")} />
                <span className={cn("text-white text-left", selectedScheduleTime && selectedDate && "text-green-400")}>
                  Choose a Schedule at your convenience
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* BELOW ARE THE CALENDAR UI Changes */}
        <div className="flex gap-3 flex-wrap justify-center">
          <div className="slide-right-containers choose-service">
            <h3 className="bg-primary font-bold text-xl p-2 text-white flex-grow-1">
              Choose a service
              <FontAwesomeIcon icon={faCircleCheck} className={cn("ml-2", selectedService && "text-green-400")} />
            </h3>
            <div className="bg-white rounded-b-md ">
              <div className="grid grid-cols-1 gap-4 p-4">
                {DENTAL_SERVICES.map((service) => {
                  return (
                    <Button
                      key={service.name}
                      className={cn(
                        "border border-solid border-secondary rounded-md p-1 bg-white hover:text-white hover:bg-primary hover:cursor-pointer text-lg overflow-hidden",
                        selectedService === service.name && "text-white bg-secondary"
                      )}
                      onClick={() => {
                        setSelectedService((prev) => {
                          return !prev || prev !== service.name ? service.name : null;
                        });
                      }}
                    >
                      <p className="font-bold hover:cursor-pointer truncate p-2">{service.name}</p>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="slide-right-containers choose-doctor">
            <h3 className="bg-primary font-bold text-xl py-2 px-4 text-white">
              Choose your Dentist
              <FontAwesomeIcon icon={faCircleCheck} className={cn("ml-2", selectedDoctor && "text-green-200")} />
            </h3>
            <DentistsList
              dentists={filteredDentists}
              showList={selectedService}
              onDentistClick={handleDentistClick}
              selectedDentist={selectedDoctor}
            />
          </div>

          <div className="bg-white h-fit rounded-md slide-right-containers choose-schedule">
            <h3 className="bg-primary font-bold text-xl py-2 text-white">
              Choose Schedule <FontAwesomeIcon icon={faCircleCheck} className={cn("ml-2", selectedDate && "text-green-400")} />
            </h3>
            <Calendar
              className="px-8"
              selected={selectedDate}
              disabled={
                !selectedDoctor
                  ? true
                  : [
                      {
                        dayOfWeek: disabledDaysForCalendar,
                      },
                    ]
              }
              fromDate={tomorrow}
              max={1}
              footer={selectedDate ? <div className="mt-4">Selected: {selectedDate.toLocaleDateString()} </div> : "Pick a day."}
              onSelect={(selectedDate) => {
                setSelectedDate(selectedDate);
              }}
              mode="single"
            />
          </div>

          <div className="bg-white h-fit rounded-md slide-right-containers choose-time">
            <h3 className="bg-primary font-bold text-xl text-white p-2">
              Choose Time <FontAwesomeIcon icon={faCircleCheck} className={cn("ml-2", selectedScheduleTime && "text-green-400")} />
            </h3>

            <div className="px-4 py-2">
              <h4 className="py-2 text-md font-bold">Available Time:</h4>
              <div className="flex flex-col gap-3 pb-2">
                {DEFAULT_APPOINTMENT_TIMES.map((appointment) => {
                  return (
                    <Button
                      key={appointment.id}
                      className={cn(
                        "border border-solid border-secondary rounded-md px-2 py-1 bg-white hover:bg-primary hover:outline-none hover:text-white hover:border-white disabled:bg-gray-200",
                        appointment.startTime === selectedScheduleTime && "bg-secondary text-white"
                      )}
                      disabled={
                        takenDentistTimes.includes(appointment.startTime) ||
                        !timeIsWithinDoctorHours(appointment.startTime, appointment.endTime) ||
                        !selectedDate
                      }
                      onClick={() => setSelectedScheduleTime(appointment.startTime)}
                    >
                      {appointment.startTime} to {appointment.endTime}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:min-w-[600px]">
        {selectedService && selectedDoctor && selectedDate && selectedScheduleTime && (
          <div className="bg-white rounded-b-md slide-right-containers choose-service">
            <BookingConfirmation
              service={selectedService}
              dentist={selectedDoctor}
              appointedDate={selectedDate}
              appointedTime={selectedScheduleTime}
              notes={notes}
              notesHandler={(e) => {
                setNotes(e.target.value);
              }}
              confirmAppointmentClick={handleCreateAppointment}
            />
          </div>
        )}
      </div>
      <DentalDialog title="Appointment Confirmation" open={openConfirmaitonDialog} onOpenChange={setOpenConfirmationDialog} disableOutsideClose>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center flex-col items-center">
            {isCreateAppointmentPending ? (
              <LoadingSpinner />
            ) : createAppointmentSuccess ? (
              <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 mb-2" size={"2x"} />
            ) : null}
            {isCreateAppointmentPending ? "Booking..." : "Thank you for booking, see you soon!"}
          </div>

          {createAppointmentSuccess && (
            <div className="flex justify-center mt-2">
              <Button
                className="w-fit text-white"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Go to dashboard
              </Button>
            </div>
          )}
        </div>
      </DentalDialog>
    </div>
  );
}
