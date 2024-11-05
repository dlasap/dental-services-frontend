"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuthContext";
import {
  cn,
  getFormattedDate,
  getFormattedTime,
  isSameDate,
} from "../lib/utils";
import LoadingSpinner from "./ui/loading-spinner";
import { useDentalinfo } from "../hooks/useDentalInfo";
import { DentalDialog } from "./dental-dialog";
import { Calendar } from "./ui/calendar";
import { DAYS_OF_WEEK, DEFAULT_APPOINTMENT_TIMES } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../hooks/useApi";

export type Appointment = {
  service: string;
  appointmentTime: string;
  appointmentId: string;
  dentistId: string;
  userId: string;
  updatedAt: string;
  notes: string;
  status: string;
  createdAt: string;
  appointmentDate: string;
};

export function AppointmentsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, any>>(
    {}
  );

  const { user } = useAuth();

  const {
    getAppointmentsByUserId,
    deleteAppointmentById,
    updateAppointmentById,
  } = useApi();

  const {
    dentistsData,
    appointmentsData,
    refecthAppointments: refetchAllAppointments,
  } = useDentalinfo();
  const [openRescheduleDialog, setOpenRescheduleDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedRescheduledDate, setSelectedRescheduledDate] =
    React.useState<Date | null>(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = React.useState<
    string | null
  >(null);

  const {
    isPending: isAppointmentsPending,
    data: appointmentByUserData,
    refetch: refetchAppointments,
    isFetching: isAppointmentsFetching,
  } = useQuery({
    queryKey: [user?.userId],
    queryFn: getAppointmentsByUserId,
    retryOnMount: true,
    staleTime: 10000,
  });
  console.log("user", user);

  const {
    isPending: isDeleteAppointmentPending,
    isSuccess: isDeleteAppointmentSuccess,
    mutate: deleteAppointment,
  } = useMutation({
    mutationFn: deleteAppointmentById,
  });

  const {
    isPending: isUpdateAppointmentPending,
    isSuccess: isUpdateAppointmentSuccess,
    mutate: updateAppointment,
  } = useMutation({
    mutationFn: updateAppointmentById,
    onSuccess: () => {
      setSelectedRescheduledDate(null);
      setSelectedScheduleTime(null);
      refetchAppointments();
      refetchAllAppointments();
    },
  });

  const dentists = React.useMemo(() => {
    return dentistsData?.data?.data.length > 0 ? dentistsData?.data?.data : [];
  }, [dentistsData]);

  const appointmentsByUser = React.useMemo(() => {
    return appointmentByUserData?.data?.data.length > 0
      ? appointmentByUserData?.data?.data
          .filter((apt) => apt.status !== "Done")
          .sort(
            (a, b) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          )
      : [];
  }, [appointmentByUserData]);

  const allAppointments = React.useMemo(() => {
    return appointmentsData?.data?.data.length > 0
      ? appointmentsData?.data?.data
      : [];
  }, [appointmentsData]);

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "status",
      sortDescFirst: true,
      header: ({ column }) => {
        return (
          <Button
            className="bg-transparent border-none shadow-none outline-none focus:outline-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-primary font-semibold">
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "service",
      header: ({ column }) => {
        return (
          <Button
            className="bg-transparent border-none shadow-none outline-none focus:outline-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-primary font-semibold">
          {row.getValue("service")}
        </div>
      ),
    },
    {
      accessorKey: "appointmentDate",
      header: ({ column }) => {
        return (
          <Button
            className="bg-transparent border-none shadow-none outline-none focus:outline-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Appointment Schdule
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        let date = row.getValue("appointmentDate");
        date = new Date(date as string).toString();
        date = getFormattedDate(date);

        let time = row.original.appointmentTime;
        time = getFormattedTime(time);
        return (
          <div className="capitalize text-primary font-semibold">
            {time} on {date as React.ReactNode}
          </div>
        );
      },
    },
    {
      accessorKey: "dentistId",
      header: ({ column }) => {
        return (
          <Button
            className="bg-transparent border-none shadow-none outline-none focus:outline-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dentist
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dentistId = row.getValue("dentistId");
        const dentist = React.useMemo(() => {
          return dentists.find((dentist) => dentistId === dentist.dentistId);
        }, [dentists]);

        return (
          <div className="capitalize text-primary font-semibold">
            {dentist?.fullName}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="capitalize text-primary font-semibold">
          {row.getValue("notes") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-2">
            <Button
              className="min-w-[80px] text-xs p-0 rounded-lg h-[25px] text-white"
              onClick={() => {
                setRowSelection(row.original);
                setOpenRescheduleDialog(true);
              }}
            >
              Reschedule
            </Button>
            <Button
              className="min-w-[80px] h-[25px] text-white text-xs p-0  bg-red-400"
              onClick={() => {
                setRowSelection(row.original);
                setOpenDeleteDialog(true);
              }}
            >
              Cancel
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: appointmentsByUser,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRescheduleAppointment = React.useCallback(async () => {
    const params = {
      ...rowSelection,
      appointmentDate: selectedRescheduledDate,
      appointmentTime: selectedScheduleTime,
    } as Record<string, any>;
    console.log("params", params);
    await updateAppointment({
      appointmentId: rowSelection?.appointmentId,
      data: params,
    });
    setTimeout(() => {
      setOpenRescheduleDialog(false);
      refetchAppointments();
    }, 1000);
  }, [rowSelection, selectedRescheduledDate, selectedScheduleTime]);

  const handleDeleteAppointment = React.useCallback(async () => {
    await deleteAppointment(rowSelection?.appointmentId);
    setTimeout(() => {
      setOpenDeleteDialog(false);
      refetchAppointments();
    }, 1000);
  }, [rowSelection]);

  const selectedAppointedDentist = React.useMemo(() => {
    return dentists.find(
      (dentist) => rowSelection?.dentistId === dentist.dentistId
    );
  }, [dentists, rowSelection]);

  const disabledDaysForCalendar = React.useMemo(() => {
    if (selectedAppointedDentist) {
      const availableDaysIndices = selectedAppointedDentist.availableDays.map(
        (day) => DAYS_OF_WEEK.indexOf(day)
      );

      const disabledDays = Array.from({ length: 7 }, (_, i) => i).filter(
        (val) => !availableDaysIndices.includes(val)
      );

      return disabledDays;
    }
    return [];
  }, [selectedAppointedDentist]);

  const takenDentistTimes = React.useMemo(() => {
    if (
      selectedRescheduledDate &&
      selectedAppointedDentist &&
      allAppointments.length > 0
    ) {
      const docAppointments = allAppointments.filter(
        (apt) => apt.dentistId === selectedAppointedDentist.dentistId
      );

      const docAppointmentsPossibleDay = docAppointments.filter((apt) => {
        return isSameDate(
          new Date(selectedRescheduledDate),
          new Date(apt.appointmentDate)
        );
      });

      const takenDates = docAppointmentsPossibleDay.map(
        (apt) => apt.appointmentTime
      );

      return takenDates;
    }
    return [];
  }, [selectedAppointedDentist, selectedRescheduledDate, allAppointments]);

  const timeIsWithinDoctorHours = React.useCallback(
    (startTime, endTime) => {
      if (selectedAppointedDentist) {
        const endTimeInNumber = Number(endTime.replace(":", ""));
        const startTimeInNumber = Number(startTime.replace(":", ""));

        const endTimeDoctor = Number(
          selectedAppointedDentist.officeHours?.end.replace(":", "")
        );
        const startTimeDoctor = Number(
          selectedAppointedDentist.officeHours?.start.replace(":", "")
        );

        return (
          startTimeInNumber >= startTimeDoctor &&
          endTimeInNumber <= endTimeDoctor
        );
      }

      return false;
    },
    [selectedAppointedDentist]
  );

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div className="w-full py-2 ">
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div
                    className={cn(
                      "w-full",
                      isAppointmentsPending && "ml-[48%]"
                    )}
                  >
                    {isAppointmentsPending || isAppointmentsFetching ? (
                      <LoadingSpinner />
                    ) : (
                      <span className="font-bold text-xl">
                        No Appointments.
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <DentalDialog
        open={openRescheduleDialog}
        onOpenChange={setOpenRescheduleDialog}
        title="Reschedule Appointment"
        description=""
      >
        <p className="text-center font-bold text-xl p-0 text-green-600">
          {" "}
          <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
          with {selectedAppointedDentist?.fullName ?? ""}
        </p>

        <div className="px-4 py-0 flex flex-col items-center justify-center text-center">
          <div>
            <h4 className="text-tertiary font-bold">
              Want to reschedule? No worries.
            </h4>
            <p className="text-green-600 text-sm">
              Just select an available schedule below.
            </p>
            <div className="flex justify-center items-start gap-x-4">
              <Calendar
                disabled={
                  !disabledDaysForCalendar
                    ? true
                    : [
                        {
                          dayOfWeek: disabledDaysForCalendar,
                        },
                      ]
                }
                selected={selectedRescheduledDate ?? undefined}
                fromDate={tomorrow}
                onSelect={(selectedDate) => {
                  setSelectedRescheduledDate(selectedDate as Date);
                }}
                mode="single"
                footer={
                  selectedRescheduledDate ? (
                    <div className="mt-4">
                      Selected: {selectedRescheduledDate.toLocaleDateString()}{" "}
                    </div>
                  ) : (
                    <p className="pt-4">Pick a day</p>
                  )
                }
              />
              <div className="bg-white h-fit rounded-md mt-2">
                <h3 className="font-bold text-md py-1 text-primary">
                  Choose Time
                </h3>

                <div className="px-4 py-2 flex justify-center self-center place-self-center">
                  <div className="flex flex-col gap-3 pb-2">
                    {DEFAULT_APPOINTMENT_TIMES.map((appointment) => {
                      return (
                        <Button
                          key={appointment.id}
                          className={cn(
                            "border border-solid border-secondary rounded-md px-2 py-1 bg-white hover:bg-primary hover:outline-none hover:text-white hover:border-white disabled:bg-gray-200",
                            appointment.startTime === selectedScheduleTime &&
                              "bg-secondary text-white"
                          )}
                          disabled={
                            takenDentistTimes.includes(appointment.startTime) ||
                            !timeIsWithinDoctorHours(
                              appointment.startTime,
                              appointment.endTime
                            )
                          }
                          onClick={() =>
                            setSelectedScheduleTime(appointment.startTime)
                          }
                        >
                          {appointment.startTime} to {appointment.endTime}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-4">
            <Button
              className="h-fit p-2 bg-secondary text-white"
              onClick={() => setOpenRescheduleDialog(false)}
              disabled={isUpdateAppointmentPending}
            >
              Back
            </Button>
            <Button
              className="h-fit p-2 bg-green-600 text-white"
              onClick={handleRescheduleAppointment}
              disabled={isUpdateAppointmentPending}
            >
              {isUpdateAppointmentPending ? (
                <span className="flex gap-2">
                  {" "}
                  <LoadingSpinner size="h-5 w-5" /> Rescheduling...{" "}
                </span>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </DentalDialog>
      <DentalDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title={"Cancel Confirmation"}
        description=""
      >
        <div className="px-2 flex flex-col justify-center items-center text-center">
          <p className="text-tertiary">
            Are you sure you want to cancel your booking on&nbsp;
            <span className="font-bold text-destructive">
              {rowSelection?.appointmentTime
                ? getFormattedTime(rowSelection?.appointmentTime)
                : ""}{" "}
              -{" "}
              {rowSelection?.appointmentDate
                ? getFormattedDate(rowSelection?.appointmentDate)
                : ""}
            </span>
            &nbsp;for your&nbsp;
            <span className="font-bold text-destructive">
              {rowSelection.service ?? ""}
            </span>
          </p>

          <div className="pt-2 flex gap-4">
            <Button
              className="h-fit p-2 bg-secondary text-white"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isDeleteAppointmentPending}
            >
              Back
            </Button>
            <Button
              className="h-fit p-2 bg-destructive text-white"
              onClick={handleDeleteAppointment}
              disabled={isDeleteAppointmentPending}
            >
              {isDeleteAppointmentPending ? (
                <span className="flex gap-2">
                  {" "}
                  <LoadingSpinner size="h-5 w-5" /> Cancelling...{" "}
                </span>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </DentalDialog>
    </div>
  );
}
