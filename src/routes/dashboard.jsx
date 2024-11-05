import { Link } from "react-router-dom";
import { AppointmentsTable } from "../components/appointments-table";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuthContext";
import { DentalCarousel } from "../components/dashboard-side-carousel";
import { DENTAL_SERVICES } from "../constants";
import { useMemo } from "react";
import { useDentalinfo } from "../hooks/useDentalInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { user } = useAuth();
  const { dentistsData } = useDentalinfo();

  const dentists = useMemo(() => {
    return dentistsData?.data?.data.length > 0 ? dentistsData?.data?.data : [];
  }, [dentistsData]);

  const servicesItems = DENTAL_SERVICES.map((services) => {
    return {
      title: services.name,
      content: services.description,
      additional_content: services.examples,
    };
  });

  const dentistsItems = useMemo(() => {
    if (dentists.length > 0) {
      return dentists.map((dentist) => {
        return {
          title: dentist.fullName,
          content: `${dentist.experienceYears} years of Dental Professionalism. Available from ${dentist.officeHours.start} to ${dentist.officeHours.end}`,
          additional_content: dentist.specialization,
        };
      });
    }
    return [];
  }, [dentists]);

  return (
    <div className="w-full gap-8 lg:m-4 sm:m-2 flex justify-between flex-wrap">
      <div className="flex-grow flex flex-col gap-8 basis-[70%] max-w-full px-2">
        <div className="bg-primary mt-[5%]">
          <h3 className="text-[3rem] text-secondary capitalize">
            Welcome,{" "}
            <span className="italic text-white uppercase">
              {user.firstName}
            </span>
          </h3>
        </div>
        <div className="bg-white min-h-[5rem] p-4">
          <div className="flex justify-between">
            <Label className="font-semibold text-2xl">
              Upcoming Appointments
            </Label>
            <Link
              to="/booking"
              className="p-2 bg-primary text-white rounded-md hover:text-secondary w-fit"
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              Book a new Appointment
            </Link>
          </div>
          <div>
            <AppointmentsTable />
          </div>
        </div>
      </div>
      <div className="flex-grow flex-shrink flex flex-col justify-start items-center">
        <div className="">
          <DentalCarousel
            showButtons={false}
            delay={5000}
            items={servicesItems}
            footerText="sample services:"
          />
        </div>
        <div className="mt-4">
          <DentalCarousel
            showButtons={false}
            delay={9000}
            footerText="specializations"
            items={dentistsItems}
          />
        </div>
      </div>
    </div>
  );
}
