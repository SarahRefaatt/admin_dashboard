"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BellIcon, Link } from "lucide-react"; // or your preferred icon library
import { useRouter } from "next/navigation";

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  empType: string;
}

type Request = {
  includes(id: number): unknown;
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
  empId: string;
  assignedTo: string;
};

export function SiteHeader() {
  const { empcode } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const [requests, setRequests] = useState<Request[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`/api/emps?employeeId=${empcode}`);
        if (!response.ok) throw new Error("Failed to fetch employee details");
        const data = await response.json();
        setEmployee(data[0] || null);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Failed to load employee data"
        );
      }
    };

    fetchRequestDetails();
  }, [empcode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/reqs2?ring`);
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();

        if (Array.isArray(data)) {
          setRequests(data);
          setPendingRequestsCount(data.length);
        } else {
          setRequests(data);
        }
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Failed to load requests"
        );
      }
    };

    fetchData();
  }, []);

const dropdownRef = useRef<HTMLDivElement | null>(null);

// Add click outside handler
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(target)) {
      // Check if the click is outside the dropdown and button
      const button = document.querySelector('.notification-button');
      if (button && !button.contains(target)) {
        setIsOpen(false);
      }
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



  
  // const toggleAnimation = () => {
  //   setIsAnimating(!isAnimating);
  // };

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark notifications as read when opening
    if (!isOpen && pendingRequestsCount > 0) {
      setPendingRequestsCount(0);
      setIsAnimating(false);
      // You might want to actually mark them as read in your backend here
    }
  };

  return (
    <header className="bg-background  flex h-16 w-full  items-center border-b px-4 shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          {/* <Separator orientation="vertical" className="h-6" /> */}

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold leading-none">
                Welcome, <span className="text-primary">{employee?.name}</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                {employee?.position} • {employee?.department}
              </p>
            </div>
          </div>
        </div>

        {employee?.empType === "SUPER_ADMIN" && (
      
          // <div className="relative">
          //   <button
          //     className="focus:outline-none relative"
          //     // Prevent event bubbling when clicking the bell
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       toggleNotifications();
          //     }}
          //   >
          //     <BellIcon
          //       className={`h-6 w-6 transition-colors ${
          //         pendingRequestsCount > 0 && isAnimating
          //           ? "text-red-500 animate-pulse"
          //           : "text-gray-500"
          //       }`}
          //     />
          //     {pendingRequestsCount > 0 && (
          //       <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow-md">
          //         {pendingRequestsCount}
          //       </span>
          //     )}
          //   </button>

          //   {/* Notification Dropdown */}
          //   {isOpen && (
          //     <div
          //       className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out ${
          //         isOpen
          //           ? "translate-y-0 opacity-100"
          //           : "-translate-y-2 opacity-0"
          //       }`}
          //       style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          //       onClick={(e) => e.stopPropagation()}
          //     >
          //       <div className="py-2">
          //         <div className="px-4 py-2 border-b border-gray-200 font-semibold text-gray-700 text-sm sticky top-0 bg-white z-10">
          //           Notifications
          //         </div>
          //         {requests.length > 0 ? (
          //           requests.map((notification) => {
          //             const isRead = readNotifications.includes(
          //               notification.id
          //             );
          //             return (
          //               <div
          //                 key={notification.id}
          //                 onClick={() => {
          //                   if (!isRead) {
          //                     setReadNotifications([
          //                       ...readNotifications,
          //                       notification.id,
          //                     ]);
          //                     setPendingRequestsCount((prev) => prev - 1);
          //                   }
          //                   // router.push(`/${empcode}/hr_document_admin`);

          //                   router.push(`/${empcode}/hr_document_admin?filter=${notification.id}`);
          //                   console.log(`filter=${notification.id}`)
          //                 }}
          //                 className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
          //                   isRead
          //                     ? "bg-white text-gray-400"
          //                     : "bg-blue-50 text-gray-800"
          //                 } hover:bg-blue-100`}
          //               >
          //                 <div className="font-semibold">
          //                   {notification.requestType || "Unassigned"}
          //                 </div>
          //                 <div className="text-xs text-gray-500">
          //                   Click to view details
          //                 </div>
          //               </div>
          //             );
          //           })
          //         ) : (
          //           <div className="px-4 py-3 text-sm text-gray-500">
          //             No new notifications
          //           </div>
          //         )}
          //       </div>
          //     </div>
          //   )}
          // </div>



          <div className="relative" ref={dropdownRef}>
      <button
        className="focus:outline-none relative notification-button"
        onClick={(e) => {
          e.stopPropagation();
          toggleNotifications();
        }}
      >
        <BellIcon
          className={`h-6 w-6 transition-colors ${
            pendingRequestsCount > 0 && isAnimating
              ? "text-red-500 animate-pulse"
              : "text-gray-500"
          }`}
        />
        {pendingRequestsCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow-md">
            {pendingRequestsCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
          style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200 font-semibold text-gray-700 text-sm sticky top-0 bg-white z-10">
              Notifications
            </div>
            {requests.length > 0 ? (
              requests.map((notification) => {
                const isRead = readNotifications.includes(
                  notification.id
                );
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!isRead) {
                        setReadNotifications([
                          ...readNotifications,
                          notification.id,
                        ]);
                        setPendingRequestsCount((prev) => prev - 1);
                      }
                      router.push(`/${empcode}/hr_document_admin?filter=${notification.id}`);
                    }}
                    className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
                      isRead
                        ? "bg-white text-gray-400"
                        : "bg-blue-50 text-gray-800"
                    } hover:bg-blue-100`}
                  >
                    <div className="font-semibold">
                      {notification.requestType || "Unassigned"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Click to view details
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
        )}
      </div>
    </header>
  );
}
