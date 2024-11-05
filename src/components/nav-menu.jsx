import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { LinkTo } from "./link";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const NavMenu = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isPathOrRegister = ["/login", "/register"].includes(location?.pathname);
  const isDashboard = location.pathname.includes("/dashboard");
  const isBooking = location.pathname.includes("/booking");

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div>
      <div className="justify-evenly gap-6 hidden md:flex">
        {user && (
          <>
            <div className={cn(isDashboard && "hidden")}>
              <LinkTo to={"/dashboard"} onClick={() => setOpenMenu(false)}>
                Dashboard
              </LinkTo>
            </div>
            <div className={cn(isBooking && "hidden")}>
              <LinkTo to={"/booking"} onClick={() => setOpenMenu(false)}>
                Booking
              </LinkTo>
            </div>
          </>
        )}

        <div
          onClick={() => {
            setOpenMenu(false);
          }}
        >
          {" "}
          <LinkTo to={isPathOrRegister ? "/#about-section" : "#about-section"}>
            About
          </LinkTo>
        </div>
        <div
          className={cn(isDashboard && "hidden")}
          onClick={() => {
            setOpenMenu(false);
          }}
        >
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
              to={
                location?.pathname?.includes("/login") ? "/register" : "/login"
              }
            >
              {location?.pathname?.includes("/login") ? "Register" : "Log In"}
            </LinkTo>
          </div>
        )}
      </div>

      <div className="flex md:hidden ">
        <DropdownMenu onOpenChange={setOpenMenu} open={openMenu}>
          <DropdownMenuTrigger
            asChild
            className="outline-none border-none hover:border-none hover:outline-none focus:border-none focus:outline-none"
          >
            <Button variant="default text-white outline-none border-none hover:border-none hover:outline-none w-5">
              <FontAwesomeIcon icon={faBars} size={"2x"} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              {user && (
                <>
                  <DropdownMenuItem className={cn(isDashboard && "hidden")}>
                    <div>
                      <LinkTo className="text-primary" to={"/dashboard"}>
                        Dashboard
                      </LinkTo>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={cn(isBooking && "hidden")}>
                    <div>
                      <LinkTo className="text-primary" to={"/booking"}>
                        Booking
                      </LinkTo>
                    </div>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem
                onClick={() => {
                  setOpenMenu(false);
                }}
              >
                {" "}
                <LinkTo
                  className="text-primary"
                  to={isPathOrRegister ? "/#about-section" : "#about-section"}
                >
                  About
                </LinkTo>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(isDashboard && "hidden")}
                onClick={() => setOpenMenu(false)}
              >
                <div>
                  {" "}
                  <LinkTo
                    className="text-primary"
                    to={
                      isPathOrRegister
                        ? "/#services-section"
                        : "#services-section"
                    }
                  >
                    Services
                  </LinkTo>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              {user ? (
                <>
                  <LinkTo
                    className="text-primary"
                    to="/"
                    onClick={() => logout()}
                  >
                    Log out
                  </LinkTo>
                </>
              ) : (
                <div>
                  <LinkTo
                    className="text-primary"
                    to={
                      location?.pathname?.includes("/login")
                        ? "/register"
                        : "/login"
                    }
                  >
                    {location?.pathname?.includes("/login")
                      ? "Register"
                      : "Log In"}
                  </LinkTo>
                </div>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
