import axiosInstance from "../api/axios-instance";
import { useAuth } from "./useAuthContext";

const storedSession = localStorage.getItem("session");
const session = JSON.parse(storedSession);

export const useApi = () => {
  const { userToken } = useAuth();

  const token = userToken ?? session?.token;

  const getDentists = async () => {
    if (token) {
      const response = await axiosInstance.get("/api/dentists", {
        headers: {
          Authorization: token,
        },
      });

      return response;
    }

    return;
  };
  const getAppointments = async () => {
    if (token) {
      const response = await axiosInstance.get(`/api/appointments`, {
        headers: {
          Authorization: token,
        },
      });
      return response;
    }
    return;
  };

  const getAppointmentsByUserId = async ({ queryKey }) => {
    if (token) {
      const userId = queryKey?.[0];
      const response = await axiosInstance.get(`/api/appointments/${userId}`, {
        headers: {
          Authorization: token,
        },
      });
      return response;
    }
    return;
  };

  const createAppointment = async (appointmentData) => {
    if (token) {
      const response = await axiosInstance.post(
        "/api/appointment",
        appointmentData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response;
    }
    return;
  };

  const deleteAppointmentById = async (appointmentId) => {
    if (token && appointmentId) {
      const response = await axiosInstance.delete(
        `/api/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response;
    }
    return;
  };

  const updateAppointmentById = async ({ appointmentId, data }) => {
    if (token && appointmentId) {
      const response = await axiosInstance.put(
        `/api/appointment/${appointmentId}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response;
    }
    return;
  };

  return {
    getDentists,
    getAppointments,
    getAppointmentsByUserId,
    createAppointment,
    deleteAppointmentById,
    updateAppointmentById,
  };
};
