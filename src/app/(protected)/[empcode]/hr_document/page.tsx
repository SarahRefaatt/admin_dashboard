"use client"
import DataTableDemo from "@/components/table_1";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
export default function Page() {
  const { empcode } = useParams<{ empcode: string }>();

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
  interface Request {
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
  }

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(20);
  const [inputTitles] = useState<string[]>([
    "title",
    "description",
    "requestType",
    "status",
    "id",
    "status",
    "createdAt",
    "updatedAt",
    "closedAt",
    "comments",
    "assignedToId",
    "userId",
    "assignedTo",
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading
        setLoading(true);
        setProgress(90); // Initial progress
        
        // const response = await fetch('/api/reqs');
        const response = await fetch(`/api/reqs?empId=${empcode}`, );
        // setProgress(40); // Progress after fetch starts
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // setProgress(70); // Progress after data is received
        
        console.log("API Response:", result);

        if (Array.isArray(result)) {
          setRequests(result);
        } else {
          throw new Error('Invalid data structure from API');
        }
        
        setProgress(100); // Complete
        // Small delay to show completion before hiding
        setTimeout(() => setLoading(false), 300);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // // Progress bar animation
    // const timer = setInterval(() => {
    //   setProgress((oldProgress) => {
    //     if (oldProgress >= 90) {
    //       return oldProgress; // Don't go beyond 90 until fetch completes
    //     }
    //     const diff = Math.random() * 10;
    //     return Math.min(oldProgress + diff, 90);
    //   });
    // }, 500);

    // return () => {
    //   clearInterval(timer);
    // };
  }, [empcode]);

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-100 justify-center p-4 md:p-8 flex flex-col items-center">
      <DataTableDemo data={requests} inputTitles={inputTitles} empcode={empcode} />

      <div className="grid grid-rows-2 md:grid-cols-2 gap-x-4 gap-y-2 w-full max-w-4xl mt-2">
        {/* <h1 className="text-xl font-semibold flex md:justify-start md:py-4">Request HR Letter Medical insurance</h1>
        <Link href="" passHref className="md:py-4">
          <Button className="bg-green-700 hover:bg-green-600 md:py-5 py-4 w-40 md:px-15  text-white">Human Plus</Button>
        </Link> */}
        <h1 className="text-xl font-semibold md:py-4 flex md:justify-start">{mounted ? <>{t("YoucanpresshereforanewRequest")}</>: <span className="opacity-50">&nbsp;</span>}</h1>
        <Link href={`/${empcode}/request2`} passHref className="md:py-4">
          <Button className="bg-green-700 hover:bg-green-600 md:py-5 py-4 w-40 md:px-18 text-white">{mounted ? <>{t("newRequest")}</>: <span className="opacity-50">&nbsp;</span>}</Button>
        </Link>
      </div>
    </div>
  );
}