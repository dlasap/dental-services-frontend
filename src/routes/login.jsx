import { useState } from "react";
import { useAuth } from "../hooks/useAuthContext";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { LinkTo } from "../components/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { DentalDialog } from "../components/dental-dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const cleanUpForm = () => {
    setEmail("");
    setPassword("");
  };
  const {
    login,
    openSuccessLoginDialog,
    isLoggingIn,
    openFailedLoginDialog,
    setOpenFailedLoginDialog,
    loginSuccess,
    loginData,
  } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      if (password.length < 8) {
        return setOpenFailedLoginDialog(true);
      }
      await login({
        email: email.trim().toLocaleLowerCase(),
        password,
      });
      if (loginSuccess && loginData) cleanUpForm();
    } else {
      alert("Invalid email or password");
    }
  };
  return (
    <div className="w-full flex flex-col justify-center items-center self-center gap-4 sm:pt-6">
      <form
        onSubmit={handleLogin}
        autoComplete="false"
        className="bg-primary pb-4 rounded-md"
      >
        <div className="mb-2">
          <h4 className="bg-secondary bg-opacity-100 text-2xl mb-4 font-semibold p-2 rounded-t-md text-white">
            Welcome
          </h4>

          <label htmlFor="email" className="px-20 text-white">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div className="mb-4 ">
          <label htmlFor="password" className="px-20 text-white">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            required
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

        <Button
          type="submit"
          label={isLoggingIn ? "Logging In..." : "Log In"}
          disabled={isLoggingIn}
        />
      </form>

      <div
        style={{
          textShadow: "1px 1px var(--primary-color)",
        }}
      >
        <label className="font-semibold text-white">
          Don&apos;t have an account?
        </label>
        <LinkTo to="/register">Register Here</LinkTo>
      </div>

      <DentalDialog
        description="Redirecting to your Dashboard..."
        title="Log In Success"
        open={openSuccessLoginDialog}
      />

      <DentalDialog
        title="Log In Failed"
        description="Incorrent Password / Email "
        open={openFailedLoginDialog}
        showTitleClose
        onOpenChange={setOpenFailedLoginDialog}
        showClose
      />
    </div>
  );
};

export default Login;
