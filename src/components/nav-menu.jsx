import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { LinkTo } from "./link";
import { cn } from "../lib/utils";

export const NavMenu = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isPathOrRegister = ["/login", "/register"].includes(location?.pathname);
  const isDashboard = location.pathname.includes("/dashboard");
  const isBooking = location.pathname.includes("/booking");

  return (
    <div className="justify-evenly gap-6 hidden md:flex">
      {user && (
        <>
          <div className={cn(isDashboard && "hidden")}>
            <LinkTo to={"/dashboard"}>Dashboard</LinkTo>
          </div>
          <div className={cn(isBooking && "hidden")}>
            <LinkTo to={"/booking"}>Booking</LinkTo>
          </div>
        </>
      )}

      <div>
        {" "}
        <LinkTo to={isPathOrRegister ? "/#about-section" : "#about-section"}>
          About
        </LinkTo>
      </div>
      <div className={cn(isDashboard && "hidden")}>
        {" "}
        <LinkTo
          to={isPathOrRegister ? "/#services-section" : "#services-section"}
        >
          Services
        </LinkTo>
      </div>
      {user ? (
        <>
          <LinkTo to="/" onClick={() => logout()}>
            Log out
          </LinkTo>
        </>
      ) : (
        <div>
          <LinkTo
            to={location?.pathname?.includes("/login") ? "/register" : "/login"}
          >
            {location?.pathname?.includes("/login") ? "Register" : "Log In"}
          </LinkTo>
        </div>
      )}
    </div>
  );
};
