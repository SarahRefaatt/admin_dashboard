// "use client";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { set } from "zod";

// interface Emp {
//   id: number;
//   name: string;
//   email: string;
//   department: string;
//   employeeId: string;
//   empType: string;
// }
// export default function Page() {
//   const { empcode } = useParams<{ empcode: string }>();
//   const { id } = useParams();
//   const [employee, setEmployee] = useState<Emp | null>(null);
//   const [admin, setAdmin] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(`/api/emps?employeeId=${empcode}`);

//       if (!response.ok) {
//         console.error("Failed to fetch request data");
//       }

//       const res = await response.json();
//       setEmployee(res[0]);
//     };

//     fetchData();

//     if(employee?.empType === "EMPLOYEE") {
//       setAdmin(false);
//     }else
//     {
//       setAdmin(true);
//     }
//   }, [empcode]);

//   return (
//     //     <div
//     //     className="min-h-screen flex items-center justify-center p-4 md:p-8"
//     //     style={{
//     //       backgroundImage: "url('/assets/bg1.png')",
//     //       backgroundSize: "cover",
//     //       backgroundPosition: "center",
//     //       backgroundRepeat: "no-repeat",
//     //       backgroundAttachment: "fixed"
//     //     }}
//     //   >
//     //   <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl border-t-8 border-green-600 max-w-2xl w-full p-10 text-center">
//     //     <div className="mb-6">
//     //       <svg
//     //         className="w-20 h-20 text-green-600 mx-auto"
//     //         fill="none"
//     //         stroke="currentColor"
//     //         viewBox="0 0 24 24"
//     //         xmlns="http://www.w3.org/2000/svg"
//     //       >
//     //         <path
//     //           strokeLinecap="round"
//     //           strokeLinejoin="round"
//     //           strokeWidth={2}
//     //           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//     //         />
//     //       </svg>
//     //     </div>

//     //     <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
//     //       Success!
//     //     </h1>
//     //     <h2 className="text-xl md:text-2xl text-gray-700 mb-4">
//     //       Your request was submitted successfully
//     //     </h2>

//     //     <div className="text-lg text-gray-900 font-semibold mb-6">
//     //       Request Code: <span className="text-green-700 text-2xl">{id}</span>
//     //     </div>

//     //     {/* <p className="text-md text-gray-600 mb-8">
//     //       We've received your request. The HR team will get back to you shortly.
//     //     </p> */}

//     //     ({employee?.empType === "EMPLOYEE" ? (

//     // <Link
//     //       href={`/${empcode}/helpdesk`}
//     //       className="inline-block bg-green-700 hover:bg-green-600 py-3 px-8 text-white rounded-md font-semibold transition-all duration-200 shadow-md"
//     //     >
//     //       Return to Help Desk
//     //     </Link>
//     //     ): (

//     //       <Link
//     //       href={`/${empcode}/hr_document_admin`}
//     //       className="inline-block bg-green-700 hover:bg-green-600 py-3 px-8 text-white rounded-md font-semibold transition-all duration-200 shadow-md"
//     //     >
//     //       Return to DashBoard
//     //     </Link>
//     //     )})

//     //   </div>
//     // </div>

// <div
//   className="min-h-screen flex items-center justify-center p-4"
//   style={{
//     backgroundImage: "url('/assets/bg1.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     backgroundAttachment: "fixed",
//   }}
// >
//   <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl border-t-8 border-green-600 max-w-2xl w-full p-4 md:p-8 lg:p-10 text-center transition-all duration-300 hover:shadow-2xl">
//     <div className="mb-4 md:mb-6">
//       <svg
//         className="w-16 h-16 md:w-20 md:h-20 text-green-600 mx-auto"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//         />
//       </svg>
//     </div>

//     <div className="mb-6 md:mb-8">
//       <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-2">
//         Success!
//       </h1>

// <div className="w-full max-w-full overflow-x-auto break-words text-base sm:text-lg text-gray-900 font-semibold mb-4 sm:mb-6">
//   Request Code: <span className="text-green-700 text-xl sm:text-2xl">{id}</span>
// </div>


//     </div>

//     {admin===false ? (
//       <>
//         <div className="mb-6 md:mb-8 w-full max-w-md mx-auto">
//           <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
//             Your request has been submitted successfully and is now being
//             processed.
//           </p>
//           <div className="bg-blue-50 border-l-4 border-blue-400 p-3 md:p-4 text-left text-xs md:text-sm text-gray-700">
//             <p className="font-medium mb-1 md:mb-2">What happens next?</p>
//             <ul className="list-disc pl-4 md:pl-5 space-y-1">
//               <li>
//                 We will notify you via text message concerning the status of
//                 your request.
//               </li>
//               <li>Check your dashboard for updates on this request</li>
//             </ul>
//           </div>
//         </div>
//         <Link
//           href={`/${empcode}/helpdesk`}
//           className="inline-flex items-center justify-center bg-green-700 hover:bg-green-600 py-2 md:py-3 px-6 md:px-8 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
//         >
//           <svg
//             className="w-4 h-4 md:w-5 md:h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M10 19l-7-7m0 0l7-7m-7 7h18"
//             />
//           </svg>
//           Return to Help Desk
//         </Link>
//       </>
//     ) : (
//       <>
//         <div className="mb-6 md:mb-8 w-full max-w-md mx-auto">
//           <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
//             You have successfully processed this employee request.
//           </p>
//           <div className="bg-green-50 border-l-4 border-green-400 p-3 md:p-4 text-left text-xs md:text-sm text-gray-700">
//             <p className="font-medium mb-1 md:mb-2">Next steps:</p>
//             <ul className="list-disc pl-4 md:pl-5 space-y-1">
//               <li>The employee has been notified of this completion</li>
//               <li>Request details have been recorded in the system</li>
//             </ul>
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
//           <Link
//             href={`/${empcode}/hr_document_admin`}
//             className="inline-flex items-center justify-center bg-green-700 hover:bg-green-600 py-2 md:py-3 px-4 md:px-6 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
//           >
//             <svg
//               className="w-4 h-4 md:w-5 md:h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//               />
//             </svg>
//             Return to Dashboard
//           </Link>
//         </div>
//       </>
//     )}
//   </div>
// </div>
//   );
// }
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
interface Emp {
  id: number;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  empType: string;
}

export default function Page() {
  const { empcode, id } = useParams<{ empcode: string; id: string }>();
  const [employee, setEmployee] = useState<Emp | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/emps?employeeId=${empcode}`);
        setProgress(50); // Set progress to 50% after starting fetch
        if (!response.ok) {
          console.error("Failed to fetch request data");
          return;
        }

        const res = await response.json();
        setEmployee(res[0]);
        setProgress(80); // Set progress to 100% after fetching data
        setAdmin(res[0]?.empType !== "EMPLOYEE");
        setProgress(100); // Set progress to 100% after processing data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchData();
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
    
<div
  className="min-h-screen flex items-center justify-center p-4"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
  <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl border-t-8 border-green-600 max-w-2xl w-full p-4 md:p-8 lg:p-10 text-center transition-all duration-300 hover:shadow-2xl">
    <div className="mb-4 md:mb-6">
      <svg
        className="w-16 h-16 md:w-20 md:h-20 text-green-600 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-2">
        {t("successTitle")}
      </h1>
      <div className="w-full max-w-full overflow-x-auto break-words text-base sm:text-lg text-gray-900 font-semibold mb-4 sm:mb-6">
        {t("requestCode")}: <span className="text-green-700 text-xl sm:text-2xl">{id}</span>
      </div>
    </div>

    {!admin ? (
      <>
        <div className="mb-6 md:mb-8 w-full max-w-md mx-auto">
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            {t("userSuccessMessage")}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 md:p-4 text-left text-xs md:text-sm text-gray-700">
            <p className="font-medium mb-1 md:mb-2">{t("whatHappensNext")}</p>
            <ul className="list-disc pl-4 md:pl-5 space-y-1">
              <li>{t("smsNotification")}</li>
              <li>{t("checkDashboard")}</li>
            </ul>
          </div>
        </div>
        <Link
          href={`/${empcode}/helpdesk`}
          className="inline-flex items-center justify-center bg-green-700 hover:bg-green-600 py-2 md:py-3 px-6 md:px-8 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("returnToHelpDesk")}
        </Link>
      </>
    ) : (
      <>
        <div className="mb-6 md:mb-8 w-full max-w-md mx-auto">
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            {t("adminSuccessMessage")}
          </p>
          <div className="bg-green-50 border-l-4 border-green-400 p-3 md:p-4 text-left text-xs md:text-sm text-gray-700">
            <p className="font-medium mb-1 md:mb-2">{t("nextSteps")}</p>
            <ul className="list-disc pl-4 md:pl-5 space-y-1">
              <li>{t("employeeNotified")}</li>
              <li>{t("detailsRecorded")}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <Link
            href={`/${empcode}/hr_document_admin`}
            className="inline-flex items-center justify-center bg-green-700 hover:bg-green-600 py-2 md:py-3 px-4 md:px-6 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t("returnToDashboard")}
          </Link>
        </div>
      </>
    )}
  </div>
</div>
  );
}