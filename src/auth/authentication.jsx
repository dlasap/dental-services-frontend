import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios-instance";
import { isTokenExpired } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const registerUser = async (userData) => {
  const response = await axiosInstance.post("/register", userData);
  return response;
};

const loginUser = async (userData) => {
  const response = await axiosInstance.post("/login", userData);

  return response;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);

  const [openSuccessRegisterDialog, setOpenSuccessRegisterDialog] =
    useState(false);
  const [openSuccessLoginDialog, setOpenSuccessLoginDialog] = useState(false);
  const [openFailedLoginDialog, setOpenFailedLoginDialog] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const navigate = useNavigate();

  const {
    mutate: login,
    isPending: isLoggingIn,
    isError: isLoginError,
    error: loginError,
    isSuccess: loginSuccess,
    status: loginStatus,
    data: loginData,
    reset: loginReset,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ data }) => {
      setOpenSuccessLoginDialog(true);

      const { data: userData, token } = data;
      setUser(userData);
      setUserToken(token);
      localStorage.setItem(
        "session",
        JSON.stringify({
          token,
          userData,
        })
      );

      // Invalidate queries related to user data so they refetch
      queryClient.invalidateQueries(["userData", "dentists", "appointments"]); // assuming 'userData' is a query key for user info

      setTimeout(() => {
        setOpenSuccessLoginDialog(false);
        loginReset();
        navigate("/dashboard");
      }, 3000);
    },
    onError: (error) => {
      setOpenFailedLoginDialog(true);
      console.error("Login failed:", error);
    },
  });

  const {
    mutate: register,
    isPending: isRegistering,
    isError: isRegisterError,
    error: registerError,
    isSuccess: registerSuccess,
    status: registerStatus,
    data: registerData,
    reset: registerReset,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setOpenSuccessRegisterDialog(true);
      setTimeout(() => {
        setOpenSuccessRegisterDialog(false);
        registerReset();
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
  const logout = () => {
    loginReset();
    setUser(null);
    setUserToken(null);
    localStorage.removeItem("session");
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      isRegistering,
      isRegisterError,
      registerError,
      registerSuccess,
      registerStatus,
      isLoggingIn,
      isLoginError,
      loginError,
      loginSuccess,
      loginStatus,
      openSuccessRegisterDialog,
      setOpenSuccessRegisterDialog,
      openSuccessLoginDialog,
      setOpenSuccessLoginDialog,
      openFailedLoginDialog,
      setOpenFailedLoginDialog,
      registerData,
      loginData,
      userToken,
    }),
    [
      user,
      isRegistering,
      isRegisterError,
      registerError,
      registerSuccess,
      register,
      registerStatus,
      isLoggingIn,
      isLoginError,
      loginError,
      loginSuccess,
      loginStatus,
      openSuccessRegisterDialog,
      setOpenSuccessRegisterDialog,
      openSuccessLoginDialog,
      setOpenSuccessLoginDialog,
      openFailedLoginDialog,
      setOpenFailedLoginDialog,
      registerData,
      loginData,
      userToken,
    ]
  );

  useEffect(() => {
    const sessionJson = localStorage.getItem("session");
    const storedSession = typeof sessionJson === "string" ? JSON.parse(sessionJson ?? "{}") : {};

    if (user && user.userId !== storedSession?.userData?.userid) setUser(null);

    if (storedSession?.token && storedSession?.userData) {
      const isExpired = isTokenExpired(storedSession);

      if (isExpired) {
        localStorage.removeItem("session");
        setUser(null);
        navigate("/login");
      }

      setUser(storedSession?.userData);
      setUserToken(storedSession?.token);
    }
  }, [navigate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: React.Children,
};
