"use client";


import Navigation from "@/components/Navigation";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useState } from "react";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
interface Data {
  navMain: {
    title: string;
    icon?: string;
    isActive?: boolean;
    url: string;
    items?: {
      title: string;
      icon?: string;
      disabled?: boolean;
      target?: boolean;
      url: string;
      isActive?: boolean;
    }[];
  }[];
} 

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  const data: Data = {
   navMain: [
        {
          title: "Getting Started",
          url: "#",
          items: [
            {
              title: "Home",
              url: "/",
              icon: 'HomeIcon',
            },
            {
              title: "Tasks",
              url: "/tasks",
              icon: 'ClipboardCheckIcon',
            },
          ],
        },
        {
          title: "Communication",
          url: "#",
          items: [
            {
              title: "Newsletter",
              url: "/newsletter",
              icon: 'Calendar',
             
            },
            {
              title: "E-Business Card",
              url: "/ebussinesscard",
              icon: 'IdCard',
              disabled: true,
            },
            {
              title: "Training Center",
              url: "/trainingcenter",
              icon: 'GalleryVertical',
              disabled: true,
            },
          ],
        }, 
        {
          title: "Department",
          url: "#",
          items: [
            {
              title: "Customer Service",
              url: "/cs",
              icon: 'Calendar',
             
            },
            {
              title: "Maintance",
              url: "/mc",
              icon: 'IdCard',
         
            },
            {
              title: "Performance",
              url: "/performance",
              icon: 'GalleryVertical',
             
            },  {
              title: "Operation",
              url: "/operation",
              icon: 'SlackIcon',
             
            },
          ],
        },
        {
          title: "Human Resources",
          url: "#",
          items: [
            {
              title: "HR Documents",
              url: "/hrdocuments",
              icon: 'FileStack',
             
            },
            {
              title: "HR Service Disk",
              url: "/hrservicedisk",
              icon: 'Users2Icon',
              disabled: true,
            },
            {
              title: "Kelio",
              url: "https://attendance.mobilitycairo.com/open/login",
              target: true,
              icon: 'AlarmClock',
            },
            {
              title: "TalentSoft",
              url: "https://ratpdev.talent-soft.com/",
              target: true,
              icon: 'Crown',
            },
            {
              title: "Payslip",
              url: "https://hrservices.mobilitycairo.com/selfservice/",
              target: true,
              icon: 'EuroIcon',
            },
          ],
        },
        {
          title: "Documents",
          url: "#",
          items: [
            {
              title: "Policies",
              url: "/policies",
              icon: 'ScrollTextIcon',
              disabled: true,
            },
            {
              title: "Templates",
              url: "/templates",
              icon: 'FileSpreadsheet',
              disabled: true,
            },
            {
              title: "Compliance",
              url: "/compliance",
              icon: 'ScaleIcon',
              disabled: true,
            },
          ],
        },
        {
          title: "Digital",
          url: "#",
          items: [
            {
              title: "User Guide",
              url: "/digital",
              icon: 'TvMinimalIcon',
              disabled: true,
            },
            {
              title: "Digital Service Disk",
              url: "/digitalservicedisk",
              icon: 'UsersIcon',
              disabled: true,
            },
          ],
        },
      ],
  };


  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => { 
    const storeduid = localStorage.getItem("uid");
    if (storeduid) {
      setUid(storeduid);
    } 

    const storedToken = localStorage.getItem("token");
    if (storedToken) {  
      setToken(storedToken);
    }


    if(storedToken && storeduid) {


      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: storeduid,
          token: storedToken,
        }),
      })
      .then(response => response.json())
      .then(data => {
        // handle response data if needed
        if (data.result) {
          setIsAuthenticated(true);
          // You can also store the user data or token in state if needed
        } else {
          console.error("Authentication failed:", data.message);
          // Optionally, you can redirect to login or show an error message
        }
      })
      .catch(error => {
        // handle error if needed
        console.error("Login API error:", error);
      });

      // Optionally, you can add logic here to validate the token or fetch user data
      // For example, you could make an API call to verify the token
    }
  }, []);




  return (
<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
  {isAuthenticated ? (
    <>
      <SiteHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
    </>
  ) : (
    <main className="flex-1">
      {children}
    </main>
  )}
</div>

  );
}
