import React, { useEffect, useMemo } from "react";
import { DentalInfoContext } from "./dentalInfoContext";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthContext";
import { useApi } from "./useApi";

export const DentalInfoProvider = ({ children }) => {
  const { user } = useAuth();
  const { getDentists, getAppointments } = useApi();
  const { data: dentistsData, refetch: refetchDentists } = useQuery({
    queryKey: ["dentists"],
    queryFn: getDentists,
    staleTime: 10000,
    refetchOnMount: true,
    enabled: !!user,
  });

  const { data: appointmentsData, refetch: refecthAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    staleTime: 10000,
    refetchOnMount: true,
    enabled: !!user,
  });

  const value = useMemo(
    () => ({
      dentistsData,
      appointmentsData,
      refecthAppointments,
    }),
    [dentistsData, appointmentsData, refecthAppointments]
  );

  useEffect(() => {
    refecthAppointments();
    refetchDentists();
  }, [refecthAppointments, refetchDentists, user]);

  return (
    <DentalInfoContext.Provider value={value}>
      {children}
    </DentalInfoContext.Provider>
  );
};

DentalInfoProvider.propTypes = {
  children: React.Children,
};
