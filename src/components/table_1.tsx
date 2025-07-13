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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

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

import { z } from "zod";

type Request = {
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  comments: string[];
  assignedToId: number;
  userId: string;
  assignedTo: string;
};

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  requestType: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date(),
  comments: z.array(z.string()),
  assignedToId: z.number(),
  userId: z.string(),
  assignedTo: z.string(),
});

const createColumns = (
  empcode: string,
  mounted: boolean,
  t: (key: string, options?: any) => string
): ColumnDef<z.infer<typeof schema>>[] => [
  {
    accessorKey: "title",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("request")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => <div className="px-2 py-3 text-center capitalize">{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? <>{t("id")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => <div className="px-2 py-3 text-center">{row.original.id}</div>,
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
         )} <ArrowUpDown className="ml-2 h-4 w-4" />
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
    accessorKey: "status",
    header: () => (
      <div className="px-2 py-3 text-center">
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
          colorClass = "text-yellow-500";
          break;
        case "REJECTED":
          colorClass = "text-red-700";
          break;
        default:
          colorClass = "text-gray-500";
      }

      return (
        <div className={`px-2 py-3 text-center font-medium ${colorClass}`}>
          {status}
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? <>{t("createdOn")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.createdAt;
      const date = raw instanceof Date ? raw : new Date(raw);
      return <div className="px-2 py-3 text-center">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "closedAt",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? <>{t("closedon")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.closedAt;
      if (!raw) return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      return <div className="px-2 py-3 text-center">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "userId",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? <>{t("MyRequest")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-3 text-center">
        <Link
          href={`/${empcode}/hr_document/${row.original.id}`}
          className="inline-block bg-green-700 hover:bg-green-600 py-2 px-4 text-white rounded text-center transition-colors duration-200"
        >
          {mounted ? <>{t("View")}</> : <span className="opacity-50">&nbsp;</span>}
        </Link>
      </div>
    ),
  },
];
export default function DataTableDemo({
  data,
  inputTitles,
  empcode,
}: {
  data: Request[];
  inputTitles: string[];
  empcode: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => createColumns(empcode, mounted, t),
    [empcode, mounted, t]
  );
  const table = useReactTable({
    data,
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

  return (
    <div className="w-full h-auto">
      <h1 className="text-3xl font-serif pl-2">{mounted ? <>{t("MyRequests")}</> : <span className="opacity-50">&nbsp;</span>}</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder={mounted ? t("filter") : ""}
          value={
        (table.getColumn("requestType")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
        table.getColumn("requestType")?.setFilterValue(event.target.value)
          }
          className="bg-white text-base px-4 py-3 w-80" // Increased size for better visibility
        />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns <ChevronDown />
        </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) =>
              column.toggleVisibility(!!value)
            }
          >
            {column.id}
          </DropdownMenuCheckboxItem>
            )
          })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border px-10">
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
                 {mounted ? <>{t("noResults")}</> : <span className="opacity-50">&nbsp;</span>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
           {mounted ? <>{t("previous")}</> : <span className="opacity-50">&nbsp;</span>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
           {mounted ? <>{t("next")}</> : <span className="opacity-50">&nbsp;</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
