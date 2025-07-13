"use client";
import DataTable from "@/components/table_2";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
interface Request {
  emp: any;
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  closedAt: Date;
  assignedToId: number;
  userId: string;
  assignedTo: string;
  reply: string;
  name: string;
  email: string;
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
}

interface Emp {
  id: number;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  empType: string;
  typeOfWork:string[];
}



export default function Page() {
  const { empcode } = useParams<{ empcode: string }>();
  const router = useRouter();

  const [emp, setEmp] = useState<Emp | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessChecked, setAccessChecked] = useState(false); // New state to track access check completion
  const [progress, setProgress] = useState(20);
const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  // RTL/LTR handling
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }
    setMounted(true);
  }, [i18n.language]);

  
const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
const filter = searchParams ? searchParams.get('filter') : null;
console.log("Filter page:", filter);
  const inputTitles = [
    "title",
    "description",
    "requestType",
    "status",
    "createdAt",
    "employee.name",
    "employee.department",
    "employee.email",
    "assignedTo",
    "reply",
  ];

  // Fetch employee on load
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await fetch(`/api/emps?employeeId=${empcode}`);
        const data = await res.json();

        if (data?.length > 0) {
          setEmp(data[0]);
          setProgress(30);
          setAccessChecked(true); // Mark access check as complete
        } else {
          setAccessChecked(true); // Even if no employee found, mark as complete
        }
      } catch (err) {
        console.error("Failed to load employee:", err);
        setAccessChecked(true); // Mark as complete even on error
      }
    };
    fetchEmp();
  }, [empcode]);

  // Fetch only if user is admin
  useEffect(() => {
    if (!emp || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(emp.empType)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setProgress(40);
        const [reqsRes, empsRes] = await Promise.all([
          // fetch(
          //   emp.empType === "ADMIN"
          //     ? `/api/reqs?assignedId=${emp.employeeId}`
          //     : "/api/reqs"
          // ),
          fetch(
            emp.empType === "ADMIN"
              ? `/api/reqs2?assignedId=${emp.employeeId}`
              : emp.empType === "MANAGER"
              ? `/api/reqs2?managerId=${emp.employeeId}`
              : "/api/reqs2"
          ),
          fetch("/api/emps"),
        ]);

        setProgress(90);

        const reqs = await reqsRes.json();

        //         if(!Array.isArray(reqs)) {
        //           console.error("Invalid response format for requests:", reqs);
        // const filteredData = reqs.map((req: { req: Request; }) => {
        //   // Sort requestHistory by time (newest first)
        //   const sortedHistory = [...req.].sort((a, b) =>
        //     new Date(b.time).getTime() - new Date(a.time).getTime()
        //   );

        //   // Keep only the most recent history entry
        //   const mostRecentHistory = sortedHistory[0] || null;

        //   return {
        //     ...request,
        //     requestHistory: mostRecentHistory ? [mostRecentHistory] : []
        //   };
        // });
        //         }
        const emps = await empsRes.json();
        console.log("Requestsfewgf:", reqs);

        const joined = (Array.isArray(reqs) ? reqs : []).map((r: Request) => {
          const user = emps.find((e: Emp) => e.employeeId === r.userId) || {};
          return { ...r, ...user };
        });
        setProgress(100);

        setRequests(joined);
        setEmployees(emps);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emp]);

  const [uid, setUid] = useState<string | null>(null);


  useEffect(() => { 
    const storeduid = localStorage.getItem("uid");
    if (storeduid) {
      setUid(storeduid);
    } }, []);
    console.log("UIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:", uid);
  // Show loading screen until we know the access status
  if (loading || !accessChecked) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 ${i18n.language === 'ar' ? 'rtl' : ''}`}>
        <div className="w-full max-w-md px-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {Math.round(progress)}% {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!emp || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(emp.empType)) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 bg-cover bg-fixed bg-center bg-no-repeat ${i18n.language === 'ar' ? 'rtl' : ''}`}
        style={{ backgroundImage: "url('/assets/bg1.png')" }}
      >
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg border-4 border-green-600 max-w-lg w-full text-center p-8">
          <svg
            className="w-16 h-16 text-red-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t("accessDenied")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("noPermission")}
          </p>
          <a
            href={`/${empcode}/helpdesk`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {t("returnToHelpdesk")}
          </a>
          <div className="mt-6 text-sm text-gray-500">
            {t("needHelp")}{" "}
            <a
              href="mailto:support@example.com"
              className="text-green-700 underline"
            >
              {t("contactSupport")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 p-4 md:p-8 ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      <DataTable
        filter={Array.isArray(filter) ? filter[0] : filter}
        data={requests}
        admins={employees.filter((e) =>
          ["ADMIN", "SUPER_ADMIN"].includes(e.empType)
        )}
        inputTitles={inputTitles}
        empcode={empcode}
        emp={emp}
      />
    </div>
  );
}

