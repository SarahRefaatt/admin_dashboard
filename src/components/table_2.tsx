"use client";

import * as React from "react";
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
  Column,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowUpDown, CheckIcon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
// If you have a DatePicker component, import it here. Example using react-datepicker:
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
import { CellContext } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { exportToExcel } from "@/lib/utils";
import { IconDownload, IconSearch } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";

// For your specific data type
type RequestCellContext = CellContext<RequestWithAdmins, unknown>;
type Admin = {
  id: number;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  empType: string;
  typeOfWork: string[];
};

type Request = {
  emp: Admin;
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  closedAt: Date | null;
  assignedToId: number | null;
  userId: string;
  assignedTo: string;
  reply: string;
  department: string;
  employeeId: string;
  empType: string;
  project: string;
  // assignedId: string | null;
  counter: number;
  assignedAt: Date | null;
  requestHistory: {
    assignedby: string;
    assignedto: string;
    time: Date;
  }[];
};
// type RequestHistory = {
//   assignedby: string;
//   assignedto: string;
// };
type RequestWithAdmins = Request & {
  admins?: Admin[];
};

interface DataTableProps {
  filter: string;
  data: Request[];
  inputTitles: string[];
  admins: Admin[];
  empcode: string;
  emp: Admin;
}

function AssignedToCell({
  row,
  employees,
  isLoadingEmployees,
  empcode,
}: {
  row: RequestCellContext["row"];
  employees: Admin[];
  isLoadingEmployees: boolean;
  empcode: string;
}) {
  // console.log("Selected fff ID:", row.original?.requestHistory?.assignedto);

  const [currentEmployeeId, setCurrentEmployeeId] = useState(
    Array.isArray(row.original?.requestHistory) &&
      row.original.requestHistory.length > 0
      ? row.original.requestHistory[row.original.requestHistory.length - 1]
          ?.assignedto || ""
      : ""
    // row.original?.assignedId || ""
  );

  // console.log("HEREEEEEEEEE",row.original)
  // for(const employee of employees) {

  //   console.log("TYPEOFWORK: ", employee.typeOfWork);
  // }

  const newEmployees = employees.filter((employee) => {
    let match;
    if (employee.empType === "SUPER_ADMIN") {
      match = true;
    } else {
      // match = employee.typeOfWork=== row.original.requestType;

      match = employee.typeOfWork.includes(row.original.requestType);
    }

    if (match) {
      console.log("####################");
      console.log(
        "emp:",
        employee.typeOfWork,
        "requestType:",
        row.original.requestType
      );
      console.log("####################");
    }

    return match; // Only employees where this is `true` will be included
  });

  console.log("MATCHED", newEmployees); // This will log the filtered array

  const handleEmpChange = async (employeeId: string) => {
    const previous = currentEmployeeId;
    setCurrentEmployeeId(employeeId);

    console.log("row:", row.original);
    console.log("Selected Employee ID:", currentEmployeeId);

    try {
      const employee = employees.find((e) => e.employeeId === employeeId);
      if (!employee) throw new Error("Employee not found");

      const newCounter = (row.original.counter || 0) + 1;
      // First update the request assignment
      // const res = await fetch(
      //   `/api/reqs?id=${row.original.id}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       assignedId: employee.employeeId,
      //       adminId: empcode,
      //       counter: newCounter,
      //       assignedAt: new Date(),
      //     }),
      //   }
      // );
      const res = await fetch(`/api/reqs2?id=${row.original.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedby: empcode,
          assignedto: employeeId,

          counter: newCounter,
          assignedAt: new Date(),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Only proceed with email if assignment was successful
      const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">📩 New HR Request Assigned</h2>
        </div>
        <div style="padding: 25px; color: #333;">
          <p style="font-size: 16px;">Hello ${employee.name || ""},</p>
          <p style="font-size: 16px;">You have been assigned a new HR request. Please find the details below:</p>
          <div style="background: #f1f5f9; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <p style="margin: 8px 0; font-size: 15px;"><strong>🆔 Request ID:</strong> ${
              row.original.id
            }</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>📄 Request Type:</strong> ${
              row.original.requestType
            }</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="font-size: 16px;">Click below to view and process the request:</p>
          <a href="https://hrhelpdesk-sig6.vercel.app/${
            employee.employeeId
          }/hr_document_admin/${row.original.id}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 20px; 
                    text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">
            🔗 View Request in Portal
          </a>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            This is an automated message. Please do not reply.
          </p>
        </div>
      </div>
    `;

      // Send email notification
      const emailResponse = await fetch(
        `/api/mails?employeeId=${employee.employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: emailHtml }),
          // body: JSON.stringify({
          //   html: emailHtml,
          // }),
        }
      );

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email error:", errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }

      // Update the counter in the row data
      row.original.counter = newCounter;
      toast.success("Request assigned and notification sent successfully!");
      console.log("Email sent successfully!");
    } catch (e) {
      setCurrentEmployeeId(previous);
      console.error("Assignment error:", e);
      toast.error(
        e instanceof Error ? e.message : "Failed to update assignment"
      );
    }
  };

  if (isLoadingEmployees) {
    return <Skeleton className="h-6 w-full" />;
  }

  return (
    <div className="flex items-center gap-2">
      {/* <h1>{row.original.requestType}</h1> */}
      <select
        value={currentEmployeeId}
        onChange={(e) => handleEmpChange(e.target.value)}
        className="w-[150px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {/* <option value="">Unassigned</option>

        {employees.map((emp) => (
          <option key={emp.employeeId} value={emp.employeeId}>
            {emp.name}
          </option>
        ))} */}

        <option value="">Unassigned</option>

        {newEmployees.map((emp) => (
          <option key={emp.employeeId} value={emp.employeeId}>
            {emp.name}
          </option>
        ))}
      </select>
    </div>
  );
}
const createColumns = (
  employees: Admin[],
  isLoadingEmployees: boolean,
  emp: Admin,
  empcode: string,
  mounted: boolean,
  t: (key: string) => string
): ColumnDef<RequestWithAdmins>[] => [
  {
    accessorKey: "Request",
    header: () => (
      <div className="px-4 py-2 text-center">
        {mounted ? (
          <>{t("request")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.index + 1}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="px-4 py-2 text-center">
        {mounted ? <>{t("ID")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.id}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "requestType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-4 py-2 w-full justify-center font-semibold"
        onClick={() => {
          const isSorted = column.getIsSorted();
          if (!isSorted) {
            column.toggleSorting(false); // sort asc
          } else if (isSorted === "asc") {
            column.toggleSorting(true); // sort desc
          } else {
            column.clearSorting(); // reset sort
          }
        }}
      >
        {mounted ? (
          <>{t("RequestType")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}{" "}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center lowercase">
        {row.original.requestType}
      </div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "project",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("project")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.project}</div>
    ),
    enableHiding: true,
  },
  ...(emp?.empType === "SUPER_ADMIN" || emp?.empType === "MANAGER"
    ? [
        {
          accessorKey: "assignedTo",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("assignedTo")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <AssignedToCell
                row={row}
                employees={employees}
                isLoadingEmployees={isLoadingEmployees}
                empcode={empcode}
              />
            </div>
          ),
          enableHiding: true,
        },
        {
          accessorKey: "Reassigned",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("reAssign")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => {
            const reassignCount = row.original.counter || 0;
            return (
              <div
                className={`px-4 py-2 text-center font-medium ${
                  reassignCount > 1 ? "text-orange-500" : ""
                }`}
              >
                {reassignCount > 1 ? "REASSIGNED" : "--------------"}
              </div>
            );
          },
          filterFn: (
            row: { original: { counter: any } },
            columnId: any,
            filterValue: boolean
          ) => {
            if (filterValue === true) {
              return (row.original.counter || 0) > 1;
            }
            if (filterValue === false) {
              return (row.original.counter || 0) <= 1;
            }
            return true; // show all when no filter is set
          },
          enableHiding: true,
        },
      ]
    : []),
  {
    accessorKey: "employeeName",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("requestby")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.emp?.name}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted && typeof t === "function" && t("createdOn") !== "createdOn"
          ? t("createdOn")
          : "Created On"}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original.createdAt;
      const date = raw instanceof Date ? raw : new Date(raw);
      return (
        <div className="px-4 py-2 text-center">{date.toLocaleDateString()}</div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "Assigned_On",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("Assigned_On")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.assignedAt;
      if (!raw)
        return <div className="px-4 py-2 text-center">------------</div>; // Show "---" if no date
      const date = raw instanceof Date ? raw : new Date(raw);
      return (
        <div className="px-4 py-2 text-center">{date.toLocaleDateString()}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("status")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "";
      switch (status) {
        case "COMPLETED":
          colorClass = "text-green-600";
          break;
        case "PENDING":
          colorClass = "text-yellow-500"; // or 'text-amber-500'
          break;
        case "REJECTED":
          colorClass = "text-red-700";
          break;
        default:
          colorClass = "text-gray-500"; // Fallback for unknown statuses
      }
      return (
        <span className={`px-4 py-2 text-center font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "closedAt",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("closedon")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.closedAt;
      if (!raw)
        return <div className="px-4 py-2 text-center">------------</div>; // Show "---" if no date
      const date = raw instanceof Date ? raw : new Date(raw);
      return (
        <div className="px-4 py-2 text-center">{date.toLocaleDateString()}</div>
      );
    },
  },
  ...(emp?.empType === "ADMIN"
    ? [
        {
          accessorKey: "userId",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("action")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <Link
                href={`/${empcode}/hr_document_admin/${row.original.id}`}
                className="inline-block bg-green-700 hover:bg-green-600 py-2 px-8 text-white rounded text-center"
              >
                {mounted ? (
                  <>{t("action")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
              </Link>
            </div>
          ),
          enableHiding: true,
        },
      ]
    : []),
  ...(emp?.empType === "SUPER_ADMIN" || emp?.empType === "MANAGER"
    ? [
        {
          accessorKey: "View",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("view")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <Link
                href={`/${empcode}/hr_document_admin/${row.original.id}`}
                className="inline-block bg-green-700 hover:bg-green-600 py-2 px-8 text-white rounded text-center"
              >
                {mounted ? (
                  <>{t("view")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
              </Link>
            </div>
          ),
          enableHiding: true,
        },
      ]
    : []),
];

export default function DataTable({
  filter,
  data,
  admins,
  inputTitles,
  empcode,
  emp,
}: DataTableProps) {
  const [tableData, setTableData] = useState<RequestWithAdmins[]>(data);
  const [employees, setEmployees] = useState<Admin[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true); // Start with true
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Add state for date range selection for export
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply RTL styling if needed when the component mounts
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }

    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
  }, [i18n.language]);

  React.useEffect(() => {
    setTableData(data);
    console.log("$$$$$$$$$$$$$");
    console.log("Data updated:", data[0]?.requestType);
  }, [data]);

  // Memoize columns to prevent unnecessary recreations
  // Memoize columns to prevent unnecessary recreations
  const columns = React.useMemo(
    () =>
      createColumns(employees, isLoadingEmployees, emp, empcode, mounted, t),
    [employees, isLoadingEmployees, emp, empcode, mounted, t]
  );
  // Fetch employees once

  // const [requestsWithEmployees,setRequestsWithEmployees]=useState()
  // ...existing code...
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // const res = await fetch(

        let urls;
        if (emp.empType === "SUPER_ADMIN") {
          urls = [`/api/emps?empType=ADMIN`, `/api/emps?empType=SUPER_ADMIN`];
        } else {
          urls = [
            `/api/emps?managerId=${emp.employeeId}`,
            `/api/emps?empType=MANAGER`,
          ];
        }

        // Fetch all URLs and combine the results
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data2 = await Promise.all(responses.map((res) => res.json()));

        // Combine the results from both requests
        const combinedResults = data2.flat();

        console.log("Combined Results:", data);
        setEmployees(combinedResults);
      } catch (error) {
        //ASSIGNINGG PARTTT

        console.error("Error fetching employees:", error);

        console.error(error);
        toast.error("Failed to load employee list");
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    // Only fetch if we don't have employees yet
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees.length, emp.empType, emp.employeeId]);
  // ...existing code...

  const table = useReactTable({
    data: tableData,

    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      updateData: (rowIndex: number, columnId: any, value: any) => {
        setTableData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: {
        // Set initial visibility for columns if needed
      },
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams?.toString() || "");
  const urlFilter = urlParams.get("filter") ?? "";
  const [inputValue, setInputValue] = useState(filter);

  useEffect(() => {
    table.getColumn("id")?.setFilterValue(inputValue);

    // If filter is cleared, remove it from URL
    if (inputValue === "") {
      urlParams.delete("filter");
      router.replace(`${window.location.pathname}?${urlParams.toString()}`);
    }
  }, [inputValue, table, router]);
  useEffect(() => {
    setInputValue(filter);
  }, [filter]);

  // Initialize selected columns with visible columns
  React.useEffect(() => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getCanHide() && column.getIsVisible())
      .map((column) => column.id);
    setSelectedColumns(visibleColumns);
  }, [table]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) => {
      const newSelected = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];

      // Update table column visibility
      table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .forEach((column) => {
          column.toggleVisibility(newSelected.includes(column.id));
        });

      return newSelected;
    });
  };
  const ColumnSelector = () => {
    const [isOpen, setIsOpen] = useState(false);

    const formatColumnName = (id: string) => {
      return id === "select"
        ? "Selection"
        : id === "actions"
        ? "Actions"
        : id.replace(/([A-Z])/g, " $1").trim();
    };

    return (
      <div className="relative inline-block text-left">
        <div className="mb-2 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                {mounted ? (
                  <>{t("view")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 mx-10"
              style={{ backgroundColor: "#fff", opacity: 1 }}
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    style={{ backgroundColor: "#fff" }}
                  >
                    <span
                      className={`flex items-center ${
                        column.getIsVisible() ? "font-medium" : "font-normal"
                      }`}
                    >
                      <CheckIcon
                        className={`mr-2 h-4 w-4 ${
                          column.getIsVisible() ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {mounted ? t(column.id) : column.id}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1 max-h-60 overflow-auto">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <div
                    key={column.id}
                    onClick={() => handleColumnToggle(column.id)}
                    className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
                      selectedColumns.includes(column.id)
                        ? "bg-green-50 text-green-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                      title={`Toggle visibility for ${column.id}`}
                    />
                    {formatColumnName(column.id)}
                  </div>
                ))}
            </div>
          </div>
        )} */}
      </div>
    );
  };
  const [showPicker, setShowPicker] = useState(false);

  const handleExport = (startDate: Date, endDate: Date) => {
    // Helper to parse and format date as DD/MM/YYYY
    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return "------------";
      const d = date instanceof Date ? date : new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Filter rows by date interval (inclusive)
    const filteredRows = table.getFilteredRowModel().rows.filter((row) => {
      const original = row.original;
      const createdAt =
        original.createdAt instanceof Date
          ? original.createdAt
          : new Date(original.createdAt);
      // Compare only the date part (ignore time)
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return createdAt >= start && createdAt <= end;
    });

    // Prepare the data for export from filtered rows only
    const exportData = filteredRows.map((row) => {
      const original = row.original;
      return {
        "Request Type": original.requestType,
        Status: original.status,
        "Request By": original.emp?.name,
        "Requester ID": original.emp?.employeeId,
        "Created At": formatDate(original.createdAt),
        "Assigned At": formatDate(original.assignedAt),
        "Closed At": formatDate(original.closedAt),
        Reassigned: original.counter > 1 ? "REASSIGNED" : "--------------",
        "Request ID": original.id,
        "AssignedTo ID":
          original.requestHistory?.length > 0
            ? original.requestHistory[original.requestHistory.length - 1]
                ?.assignedto || ""
            : "Unassigned",
        "Assigned By": original.emp?.name,
        status: original.status,
      };
    });

    // Format file name as DD-MM-YYYY
    const formatFileName = (date: Date | string | null | undefined) => {
      if (!date) return "";
      const d = date instanceof Date ? date : new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    exportToExcel(
      exportData,
      `Requests_${formatFileName(startDate)}_to_${formatFileName(endDate)}`
    );
  };
  // const handleExport = () => {
  //   // Prepare the data for export
  //   const exportData = table.getFilteredRowModel().rows.map((row) => {
  //     const original = row.original;
  //     return {
  //       "Request Type": original.requestType,
  //       Status: original.status,
  //       "Request By": original.emp?.name,
  //       "Requester ID": original.emp?.employeeId,
  //       "Created At":
  //         original.createdAt instanceof Date
  //           ? original.createdAt.toLocaleDateString()
  //           : new Date(original.createdAt).toLocaleDateString(),
  //       "Assigned At":
  //         original.assignedAt instanceof Date
  //           ? original.assignedAt.toLocaleDateString()
  //           : original.assignedAt
  //           ? new Date(original.assignedAt).toLocaleDateString()
  //           : "------------",

  //       "Closed At":
  //         original.closedAt instanceof Date
  //           ? original.closedAt.toLocaleDateString()
  //           : original.closedAt
  //           ? new Date(original.closedAt).toLocaleDateString()
  //           : "------------",

  //       Reassigned: original.counter > 1 ? "REASSIGNED" : "--------------",
  //       "Request ID": original.id,
  //       "AssignedTo ID":
  //         original.requestHistory?.length > 0
  //           ? original.requestHistory[original.requestHistory.length - 1]
  //               ?.assignedto || ""
  //           : "Unassigned",
  //       "Assigned By": original.emp?.name,

  //       status: original.status,
  //     };
  //   });

  //   exportToExcel(
  //     exportData,
  //     `Requests_${new Date().toISOString().split("T")[0]}`
  //   );
  // };
  console.log("Visibility State:", columnVisibility);
  console.log(
    "Columns:",
    table.getAllColumns().map((c) => c.id)
  );
  if (isLoadingEmployees) {
    return (
      <div className="w-full h-auto space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24 ml-auto" />
        </div>
        <div className="rounded-md border space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-4 ">
      {/* <h1 className="text-3xl font-serif pl-2 mb-4">filter : {filter}</h1> */}
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif pl-2">
          {" "}
          {mounted ? (
            <>{t("MyRequests")}</>
          ) : (
            <span className="opacity-50">&nbsp;</span>
          )}
        </h1>
        {emp?.empType === "SUPER_ADMIN" && (
          // <Button
          //   onClick={handleExport}
          //   variant="outline"
          <div className="flex items-center gap-2 text-sm relative">
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="px-4 py-2 bg-black text-white rounded-md shadow"
            >
              {mounted ? (
                <>{t("export")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </button>

            {showPicker && (
              <>
                {/* Overlay to close picker when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowPicker(false)}
                  style={{ background: "transparent" }}
                />

                <div
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  className="absolute z-20 flex flex-col gap-2 bg-white border rounded-md shadow-lg mx-2"
                  style={{
                    top: "100%",
                    [i18n.language === "ar" ? "left" : "right"]: 0,
                    marginTop: "0.5rem",
                    minWidth: "260px",
                    maxWidth: "90vw",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  }}
                >
                  <div className="p-4">
                    {/* Start Date Section */}
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Start Date</h3>
                      <div className="flex gap-2 flex-wrap">
                        <select
                          value={startDate?.getFullYear() || ""}
                          onChange={(e) => {
                            const year = parseInt(e.target.value);
                            const newDate = startDate
                              ? new Date(startDate)
                              : new Date();
                            newDate.setFullYear(year);
                            setStartDate(newDate);
                          }}
                          className="border rounded px-2 py-1 flex-1 min-w-[80px]"
                        >
                          <option value="">Year</option>
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() - 5 + i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>

                        <select
                          value={startDate?.getMonth() ?? ""}
                          onChange={(e) => {
                            const month = parseInt(e.target.value);
                            if (isNaN(month)) return;
                            const newDate = startDate
                              ? new Date(startDate)
                              : new Date();
                            newDate.setMonth(month);
                            setStartDate(newDate);
                          }}
                          className="border rounded px-2 py-1 flex-1 min-w-[80px]"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i).map(
                            (month) => (
                              <option key={month} value={month}>
                                {new Date(0, month).toLocaleString(
                                  i18n.language,
                                  { month: "long" }
                                )}
                              </option>
                            )
                          )}
                        </select>

                        <DatePicker
                          selected={startDate || undefined}
                          onChange={(date) => setStartDate(date || undefined)}
                          selectsStart
                          startDate={startDate || undefined}
                          endDate={endDate || undefined}
                          placeholderText="Day"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          className="w-20 px-2 py-1 border rounded flex-1 min-w-[80px]"
                          maxDate={endDate || undefined} // Convert null to undefined
                        />
                      </div>
                    </div>

                    {/* End Date Section */}
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">End Date</h3>
                      <div className="flex gap-2 flex-wrap">
                        <select
                          value={endDate?.getFullYear() || ""}
                          onChange={(e) => {
                            const year = parseInt(e.target.value);
                            const newDate = endDate
                              ? new Date(endDate)
                              : new Date();
                            newDate.setFullYear(year);
                            setEndDate(newDate);
                          }}
                          className="border rounded px-2 py-1 flex-1 min-w-[80px]"
                        >
                          <option value="">Year</option>
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() - 5 + i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>

                        <select
                          value={endDate?.getMonth() ?? ""}
                          onChange={(e) => {
                            const month = parseInt(e.target.value);
                            if (isNaN(month)) return;
                            const newDate = endDate
                              ? new Date(endDate)
                              : new Date();
                            newDate.setMonth(month);
                            setEndDate(newDate);
                          }}
                          className="border rounded px-2 py-1 flex-1 min-w-[80px]"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i).map(
                            (month) => (
                              <option key={month} value={month}>
                                {new Date(0, month).toLocaleString(
                                  i18n.language,
                                  { month: "long" }
                                )}
                              </option>
                            )
                          )}
                        </select>

                        <DatePicker
                          selected={endDate || undefined}
                          onChange={(date) => setEndDate(date || undefined)}
                          selectsEnd
                          startDate={startDate || undefined}
                          endDate={endDate || undefined}
                          placeholderText="Day"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          className="w-20 px-2 py-1 border rounded flex-1 min-w-[80px]"
                          minDate={startDate || undefined} // Convert null to undefined
                          maxDate={new Date()}
                        />
                      </div>
                    </div>

                    {/* Validation Error Message */}
                    {startDate && endDate && startDate > endDate && (
                      <div className="text-red-500 text-sm mb-2">
                        End date must be after start date
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (startDate && endDate && startDate <= endDate) {
                          handleExport(startDate, endDate);
                          setShowPicker(false);
                        }
                      }}
                      disabled={!startDate || !endDate || startDate > endDate}
                      className="mt-2 bg-black text-white px-3 py-1 rounded disabled:opacity-50 w-full"
                    >
                      {t("confirmExport")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters Section - Compact and Professional */}
      <div className="flex flex-col sm:flex-row gap-2 items-center py-2 mb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* Status Filter */}
          <select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table
                .getColumn("status")
                ?.setFilterValue(e.target.value || undefined)
            }
            className="text-xs h-8 w-[80px] bg-white border border-gray-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">{mounted ? t("status") : "Status"}</option>
            <option value="COMPLETED">
              {mounted ? t("completed") : "Completed"}
            </option>
            <option value="PENDING">
              {mounted ? t("pending") : "Pending"}
            </option>
            <option value="REJECTED">
              {mounted ? t("rejected") : "Rejected"}
            </option>
          </select>

          {/* Request Type Filter */}
          <select
            value={
              (table.getColumn("requestType")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table
                .getColumn("requestType")
                ?.setFilterValue(e.target.value || undefined)
            }
            className="text-xs  bg-white h-8 w-[80px] border border-gray-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">{mounted ? t("types") : "Types"}</option>
            <option value="SALARY_CERTIFICATE">
              {mounted ? t("SALARY_CERTIFICATE") : "Salary Certificate"}
            </option>
            <option value="MEDICAL_INSURANCE">
              {mounted ? t("MEDICAL_INSURANCE") : "Medical Insurance"}
            </option>
            <option value="VACATION_REQUEST">
              {mounted ? t("VACATION_REQUEST") : "Vacation Request"}
            </option>
            <option value="HR_LETTTER">
              {mounted ? t("HR_LETTTER") : "HR Letter"}
            </option>
            <option value="Debit_Card">
              {mounted ? t("Debit_Card") : "Debit Card"}
            </option>
            <option value="Payment_Slip">
              {mounted ? t("Payment_Slip") : "Payment Slip"}
            </option>
            <option value="Medical_Reimbursement">
              {mounted ? t("Medical_Reimbursement") : "Medical Reimbursement"}
            </option>
            <option value="Khazna_Tech">
              {mounted ? t("Khazna_Tech") : "Khazna Tech"}
            </option>
            <option value="HumanPlus_Creation">
              {mounted ? t("HumanPlus_Creation") : "HumanPlus Creation"}
            </option>
            <option value="ONBOARDING_PROCESS">
              {mounted ? t("ONBOARDING_PROCESS") : "Onboarding Process"}
            </option>
            <option value="RESIGNATION_PROCESS">
              {mounted ? t("RESIGNATION_PROCESS") : "Resignation Process"}
            </option>
            <option value="CONTRACTS">
              {mounted ? t("CONTRACTS") : "Contracts"}
            </option>
            <option value="SOCIAL_INSURANCE">
              {mounted ? t("SOCIAL_INSURANCE") : "Social Insurance"}
            </option>
            <option value="PUBLIC_MEDICAL_INSURANCE">
              {mounted
                ? t("PUBLIC_MEDICAL_INSURANCE")
                : "Public Medical Insurance"}
            </option>
            <option value="PRIVATE_MEDICAL_INSURANCE">
              {mounted
                ? t("PRIVATE_MEDICAL_INSURANCE")
                : "Private Medical Insurance"}
            </option>
            <option value="LEAVE_REQUEST">
              {mounted ? t("LEAVE_REQUEST") : "Leave Request"}
            </option>
            <option value="KELIO_PERMISSIONS">
              {mounted ? t("KELIO_PERMISSIONS") : "Kelio Permissions"}
            </option>
            <option value="OTHER">{mounted ? t("OTHER") : "Other"}</option>
          </select>
          {emp?.empType === "SUPER_ADMIN" && (
            <select
              value={
                (table.getColumn("Reassigned")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) => {
                const value = e.target.value;
                table
                  .getColumn("Reassigned")
                  ?.setFilterValue(
                    value === "true"
                      ? true
                      : value === "false"
                      ? false
                      : undefined
                  );
              }}
              className="text-xs  bg-white h-8 w-[110px] border border-gray-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">{mounted ? t("reAssign") : "Reassigned"}</option>
              <option value="true">{mounted ? t("true") : "True"}</option>
              <option value="false">{mounted ? t("false") : "False"}</option>
            </select>
          )}

          {/* Search Input */}
          {/* <Input
            placeholder="Search requests ID ..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="h-8 max-w-xs text-xs   focus:ring-green-300 focus:border-green-00"
            // icon={<IconSearch size={14} className="text-gray-400" />}
          /> */}

          <Input
            placeholder={mounted ? t("searchRequestId") : ""}
            value={inputValue || ""}
            onChange={(event) => {
              const value = event.target.value;
              setInputValue(value);
              table.getColumn("id")?.setFilterValue(value);
            }}
            className="h-8 w-[300px] text-xs focus:ring-green-300 focus:border-green-00  bg-white"
          />
        </div>

        <ColumnSelector />
      </div>
      {/* Table Section */}
      <div className="rounded-md border  overflow-hidden">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-gray-500"
                >
                  {t("No_requests_found")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-gray-600">
          {/* Showing {table.getFilteredRowModel().rows.length} entries
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              {" "}
              ({table.getFilteredSelectedRowModel().rows.length} selected)
            </span>
          )} */}
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          {/* <div className="flex-1 text-sm text-muted-foreground">
                 {table.getFilteredSelectedRowModel().rows.length} of{" "}
                 {table.getFilteredRowModel().rows.length} row(s) selected.
               </div> */}
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {mounted ? (
                <>{t("previous")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {mounted ? (
                <>{t("next")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
