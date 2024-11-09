import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button } from "../components/button";
import { DENTAL_SERVICES } from "../constants";

export default function Root() {
  const navigate = useNavigate();
  return (
    <div
      id="services-section"
      className="h-full w-full flex flex-col gap-8 justify-evenly p-2 flex-grow"
      style={{
        minHeight: "min(70vh, 1080px)",
      }}
    >
      <section
        className="flex justify-evenly items-center flex-grow flex-wrap tagline-container"
        style={{
          minHeight: "min(90vh, 1080px)",
        }}
      >
        <div className="p-2 lg:max-w-[50%] flex flex-col gap-3 flex-grow fade-in-containers">
          <p
            id="tagline-1"
            className="text-white md:text-[4rem] text-[1.2rem] font-bold "
            style={{
              textShadow: "1px 3px rgba(0,0,0,0.2)",
            }}
          >
            Your Smile, Our Priority
          </p>
          <p
            className="text-white md:text-[40px] text-[1rem] font-semibold drop-shadow-lg"
            style={{
              textShadow: "1px 2px var(--primary-color)",
            }}
          >
            Quality Dental Care You Can Trust.
          </p>
        </div>
        <div className="bg-white rounded-lg text-black flex-shrink-0 xl:w-[50%] flex flex-col gap-3 p-3 max-w-[450px]">
          <p className="max-w-[90vw] leading-8">
            You can schedule your appointment online in just a few clicks or call our friendly front desk team for assistance. We look forward to
            providing you with exceptional dental care!
          </p>
          <Button label="Book Appointment" onClick={() => navigate("/booking")} />
        </div>
      </section>

      <h3 className="text-[3.5rem] font-bold w-full">Services</h3>

      <section
        id="about-section"
        className=" text-black grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1920px] self-center opacity-[0] fade-in-containers"
      >
        {DENTAL_SERVICES.map((service) => {
          return (
            <div
              className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 ease-in-out text-left overflow-hidden flex flex-col justify-between"
              key={service.name}
            >
              <h2 className="text-xl text-white mb-2 m-0 font-bold bg-primary p-3">{service.name}</h2>
              <p className="text-gray-600 mb-4 px-2 pt-0 leading-8">{service.description}</p>
              <div className="p-1 gap-3 grid grid-cols-2">
                {service.examples.map((example, index) => (
                  <span key={index} className="rounded-xl bg-primary px-2 text-sm h-[20px] truncate text-white text-center">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
