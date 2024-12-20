import React, { useEffect } from "react";
import { NavMenu } from "./components/nav-menu";
import { useLocation } from "react-router-dom";
import { LinkTo } from "./components/link";

export const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Select the element with the matching ID
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) {
        // Smooth scroll to the element
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [location]);
  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <section className="w-full flex justify-between bg-primary items-center pr-3 text-white xl:px-10">
        <LinkTo to="/">
          <img src="/tooth.svg" className="logo text-white invert" />
          <h1 className="text-[32px] font-bold">Dom&apos;s Dental</h1>
        </LinkTo>
        <NavMenu />
      </section>
      <section className="flex-grow w-full h-full flex pb-16 bg-[#6479b8] z-0">
        <div id="background-container" className="w-full h-full"></div>
        {children}
      </section>

      <section
        id="about-section"
        className="flex md:justify-between bg-primary p-3 mt-1 flex-wrap md:flex-col lg:flex-row gap-4 z-[1] px-[10%] justify-center "
      >
        <div className="lg:max-w-[300px] md:max-w-full text-left flex flex-col sm:self-center">
          <h5 className="text-lg font-semibold self-center text-white">Dom&apos;s Dental</h5>
          <p className="text-gray-200 text-sm text-center py-2 font-semibold">Service Hours : 8:00 AM to 5:00 PM daily</p>
          <p className="text-gray-200 text-xs text-justify leading-loose">
            Our dental clinic provides a full range of services for all ages. From routine checkups to advanced cosmetic and restorative treatments,
            we’re committed to helping you achieve a healthy, beautiful smile.
          </p>
        </div>

        <div className="text-lg lg:self-start sm:self-center text-white flex-grow-1">All Rights Reserved 2024</div>

        <div className="flex-grow-1">
          <label className="font-semibold text-lg text-white">Contact Details:</label>

          <div className="text-gray-200 mt-[1rem]">
            <p>+63 905 5610116</p>
            <p>Building 456, State</p>
            <p>XYZ City, Cebu, Philippines</p>
          </div>
        </div>
      </section>
    </div>
  );
};

Layout.propTypes = {
  children: React.Node,
};
