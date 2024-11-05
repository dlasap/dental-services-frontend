import { useMemo, useState } from "react";
import { Input } from "../components/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faEye,
  faEyeSlash,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { Button } from "../components/button";
import { LinkTo } from "../components/link";
import { useAuth } from "../hooks/useAuthContext";
import { DentalDialog } from "../components/dental-dialog";
import { cn } from "../lib/utils";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const [hasAttemptedRegister, setHasAttemptedRegister] = useState(false);

  const {
    register,
    registerError,
    isRegistering,
    registerSuccess,
    openSuccessRegisterDialog,
    registerData,
  } = useAuth();

  const cleanUpForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmedPassword("");
    setHasAttemptedRegister(false);
    setHasTypedPassword(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setHasAttemptedRegister(true);
      // Call the register function from context
      // Ensure you pass an object with the user data
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      const isNotValid =
        !email ||
        !password ||
        !passwordContainsAtleast8Characters ||
        !passwordContainsLowercaseLetter ||
        !passwordContainsNumber ||
        !passwordContainsUppercaseLetter ||
        !passwordHasNoSpaces ||
        confirmedPassword !== password;

      if (isNotValid) return;

      await register(userData);
      if (registerSuccess && registerData) cleanUpForm();
    } catch (error) {
      console.log("Register submit error:", error);
    }
  };

  const passwordContainsUppercaseLetter = useMemo(() => {
    const uppercaseRegex = /(?=.*[A-Z])/;
    return uppercaseRegex.test(password);
  }, [password]);

  const passwordContainsAtleast8Characters = useMemo(() => {
    return password.length >= 8;
  }, [password]);

  const passwordContainsLowercaseLetter = useMemo(() => {
    const lowercaseRegex = /(?=.*[a-z])/;
    return lowercaseRegex.test(password);
  }, [password]);

  const passwordContainsNumber = useMemo(() => {
    const numberRegex = /(?=.*\d)/;
    return numberRegex.test(password);
  }, [password]);

  const passwordHasNoSpaces = useMemo(() => {
    const noSpaceRegex = /^\S*$/;
    return noSpaceRegex.test(password);
  }, [password]);

  return (
    <div
      style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}
      className="flex flex-col gap-4 self-center"
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="false"
        className="bg-primary rounded-md pb-4"
      >
        <h2 className="bg-secondary bg-opacity-100 text-2xl mb-4 font-semibold p-2 rounded-t-md text-white">
          Register
        </h2>
        <div className="mb-4">
          <label className="text-white" htmlFor="firstname">
            First Name
          </label>
          <Input
            type="text"
            id="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-white" htmlFor="lastname">
            Last Name
          </label>
          <Input
            type="text"
            id="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="text-white" htmlFor="email">
            Email
          </label>
          <Input
            type="register-email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="one-time-code"
          />
          <div className="h-4">
            {registerError?.status === 409 && (
              <span className=" text-red-400 text-sm font-semibold">
                Email already taken
              </span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="px-20 text-white">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setHasTypedPassword(true);
            }}
            maxLength={20}
            renderIcon={
              <FontAwesomeIcon
                type="button"
                icon={!showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer text-primary absolute right-1 bottom-1 bg-white opacity-50 hover:opacity-100"
              />
            }
          />
        </div>
        <div className="flex flex-col gap-2 mb-2 text-xs text-left mx-[15%]">
          <p
            className={cn(
              "flex justify-between text-white",
              hasTypedPassword &&
                (passwordContainsUppercaseLetter
                  ? "text-green-400"
                  : "text-red-400")
            )}
          >
            Contains an uppercase letter{" "}
            {hasTypedPassword && (
              <FontAwesomeIcon
                icon={
                  passwordContainsUppercaseLetter
                    ? faCircleCheck
                    : faCircleXmark
                }
                className={cn(
                  "text-green-400 ",
                  !passwordContainsUppercaseLetter &&
                    "text-red-400 rounded-full"
                )}
              />
            )}
          </p>
          <p
            className={cn(
              "flex justify-between text-white",
              hasTypedPassword &&
                (passwordContainsLowercaseLetter
                  ? "text-green-400"
                  : "text-red-400")
            )}
          >
            Contains a lowercase letter{" "}
            {hasTypedPassword && (
              <FontAwesomeIcon
                icon={
                  passwordContainsLowercaseLetter
                    ? faCircleCheck
                    : faCircleXmark
                }
                className={cn(
                  "text-green-400 ",
                  !passwordContainsLowercaseLetter &&
                    "text-red-400 rounded-full"
                )}
              />
            )}
          </p>
          <p
            className={cn(
              "flex justify-between text-white",
              hasTypedPassword &&
                (passwordContainsAtleast8Characters
                  ? "text-green-400"
                  : "text-red-400")
            )}
          >
            Contains atleast 8 characters
            {hasTypedPassword && (
              <FontAwesomeIcon
                icon={
                  passwordContainsAtleast8Characters
                    ? faCircleCheck
                    : faCircleXmark
                }
                className={cn(
                  "text-green-400 ",
                  !passwordContainsAtleast8Characters &&
                    "text-red-400 rounded-full"
                )}
              />
            )}
          </p>
          <p
            className={cn(
              "flex justify-between text-white",
              hasTypedPassword &&
                (passwordContainsNumber ? "text-green-400" : "text-red-400")
            )}
          >
            Contains a number{" "}
            {hasTypedPassword && (
              <FontAwesomeIcon
                icon={passwordContainsNumber ? faCircleCheck : faCircleXmark}
                className={cn(
                  "text-green-400 ",
                  !passwordContainsNumber && "text-red-400 rounded-full"
                )}
              />
            )}
          </p>
          <p
            className={cn(
              "flex justify-between text-white",
              hasTypedPassword &&
                (passwordHasNoSpaces ? "text-green-400" : "text-red-400")
            )}
          >
            Contains no spaces{" "}
            {hasTypedPassword && (
              <FontAwesomeIcon
                icon={passwordHasNoSpaces ? faCircleCheck : faCircleXmark}
                className={cn(
                  "text-green-400 ",
                  !passwordHasNoSpaces && "text-red-400 rounded-full"
                )}
              />
            )}
          </p>
        </div>
        <div className="mb-2">
          <label className="text-white px-20" htmlFor="confirm-password">
            Confirm Password
          </label>
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            maxLength={20}
            renderIcon={
              <FontAwesomeIcon
                type="button"
                icon={!showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer text-primary absolute right-1 bottom-1 bg-white opacity-50 hover:opacity-100"
              />
            }
          />
        </div>
        <div className="h-2 mb-4 mt-2">
          {hasAttemptedRegister && password !== confirmedPassword && (
            <p className="text-xs text-left px-[15%] text-red-400">
              Password must match
            </p>
          )}
        </div>
        <Button
          type="submit"
          label={`Register${isRegistering ? "ing..." : ""}`}
          disabled={isRegistering}
        />
      </form>

      <div
        style={{
          textShadow: "1px 1px var(--primary-color)",
        }}
      >
        <label className="text-white font-semibold">
          Already have an account?
        </label>
        <LinkTo to="/login">Log in Here</LinkTo>
      </div>

      <DentalDialog
        open={openSuccessRegisterDialog}
        title="Registration Successful"
        description="Redirecting to login page ..."
      />
    </div>
  );
};

export default Register;
