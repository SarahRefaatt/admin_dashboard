/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  AlarmClock,
  BellIcon,
  Calendar,
  ClipboardCheckIcon,
  CreditCardIcon,
  Crown,
  EuroIcon,
  FileSpreadsheet,
  FileStack,
  GalleryVertical,
  GalleryVerticalEnd,
  HomeIcon,
  IdCard,
  LanguagesIcon,
  LogOutIcon,
  MoreVerticalIcon,
  ScaleIcon,
  ScrollTextIcon,
  SearchIcon,
  SlackIcon,
  TvMinimalIcon,
  UserCircleIcon,
  Users2Icon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import  LanguageSwitcher  from "@/components/LanguageSwitcher";

// Helper function to render icons by string name
const IconComponent = ({ iconName, ...props }: { iconName: string; [key: string]: any }) => {
  const iconMap: Record<string, LucideIcon> = {
    HomeIcon: HomeIcon,

    GalleryVerticalEnd: GalleryVerticalEnd,
    BellIcon: BellIcon,
    CreditCardIcon: CreditCardIcon,
    LanguagesIcon: LanguagesIcon,
    LogOutIcon: LogOutIcon,
    MoreVerticalIcon: MoreVerticalIcon,
    SearchIcon: SearchIcon,
    UserCircleIcon: UserCircleIcon,
    ClipboardCheckIcon:ClipboardCheckIcon,
    Calendar: Calendar,
    IdCard: IdCard,
    GalleryVertical: GalleryVertical,
    SlackIcon: SlackIcon,
    FileStack: FileStack,
    Users2Icon: Users2Icon,
    AlarmClock: AlarmClock,
    Crown: Crown,
    EuroIcon: EuroIcon,
    ScrollTextIcon: ScrollTextIcon,
    FileSpreadsheet: FileSpreadsheet,
    ScaleIcon: ScaleIcon,
    TvMinimalIcon: TvMinimalIcon,
    UsersIcon: UsersIcon,



  };

  const Icon = iconMap[iconName];
  if (!Icon) return null;

  return <Icon {...props} />;
};

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

const Navigation = ({
  data,
  children,
}: Readonly<{
  data?: Data | null;
  children: React.ReactNode;
}>) => {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const [activePath, setActivePath] = useState<any>(null);
  const [sideBarData, setSideBarData] = useState<Data | null>({
     navMain: [
        {
          title: "Getting Started",
          url: "#",
          items: [
            {
              title: t("side.Home"),
              url: "/",
              icon: 'HomeIcon',
            },
            {
              title: t("side.Tasks"),
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
              title: t("side.Newsletter"),
              url: "/newsletter",
              icon: 'Calendar',
             
            },
            {
              title: t("side.EBusinesscard"),
              url: "/ebussinesscard",
              icon: 'IdCard',
              disabled: true,
            },
            {
              title: t("side.Trainingcenter"),
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
              title: t("side.CustomerService"),
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
              title: t("side.HRDocuments"),
              url: "/hrdocuments",
              icon: 'FileStack',
             
            },
            {
              title: t("side.HRServiceDisk"),
              url: "/hrservicedisk",
              icon: 'Users2Icon',
              disabled: true,
            },
            {
              title: t("side.Kelio"),
              url: "https://attendance.mobilitycairo.com/open/login",
              target: true,
              icon: 'AlarmClock',
            },
            {
              title: t("side.TalentSoft"),
              url: "https://ratpdev.talent-soft.com/",
              target: true,
              icon: 'Crown',
            },
            {
              title: t("side.Payslip"),
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
              title: t("side.Policies"),
              url: "/policies",
              icon: 'ScrollTextIcon',
              disabled: true,
            },
            {
              title: t("side.Templates"),
              url: "/templates",
              icon: 'FileSpreadsheet',
              disabled: true,
            },
            {
              title: t("side.Compliance"),
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
              title: t("side.userguide"),
              url: "/digital",
              icon: 'TvMinimalIcon',
              disabled: true,
            },
            {
              title: t("side.DigitalServiceDisk"),
              url: "/digitalservicedisk",
              icon: 'UsersIcon',
              disabled: true,
            },
          ],
        },
      ],
  });

  // This ensures we only render the translated content after the component is mounted
  // to prevent hydration errors

  useEffect(() => {
    setMounted(true);
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (mounted) {
      // const data: Data = {
      //   navMain: [
      //     {
      //       title: "Getting Started",
      //       icon: HomeIcon,
      //       url: "#",
      //       items: [
      //         {
      //           title: "home",

      //           url: "/",
      //         },
      //         {
      //           title: "about",

      //           url: "/about",
      //         },
      //       ],
      //     },

      //     {
      //       title: "Human Resources",
      //       icon: HomeIcon,
      //       url: "#",
      //       items: [
      //         {
      //           title: "hr",

      //           url: "/hr",
      //         },
      //       ],
      //     },

      //     {
      //       title: "Building Your Application",
      //       icon: GalleryVerticalEnd,
      //       url: "#",
      //       items: [
      //         {
      //           title: "Routing",
      //           url: "#",
      //         },
      //         {
      //           title: "Data Fetching",
      //           url: "#",
      //         },
      //         {
      //           title: "Rendering",
      //           url: "#",
      //         },
      //         {
      //           title: "Caching",
      //           url: "#",
      //         },
      //         {
      //           title: "Styling",
      //           url: "#",
      //         },
      //         {
      //           title: "Optimizing",
      //           url: "#",
      //         },
      //         {
      //           title: "Configuring",
      //           url: "#",
      //         },
      //         {
      //           title: "Testing",
      //           url: "#",
      //         },
      //         {
      //           title: "Authentication",
      //           url: "#",
      //         },
      //         {
      //           title: "Deploying",
      //           url: "#",
      //         },
      //         {
      //           title: "Upgrading",
      //           url: "#",
      //         },
      //         {
      //           title: "Examples",
      //           url: "#",
      //         },
      //       ],
      //     },

      //     {
      //       title: "Community",
      //       url: "#",
      //       items: [
      //         {
      //           title: "Contribution Guide",
      //           url: "#",
      //         },
      //       ],
      //     },
      //   ],
      // };

      const s = data?.navMain.map((item) => {
        // Create a shallow copy to avoid mutating the original data
        const newItem = { ...item };
        newItem.isActive = newItem.url === pathName;

        if (newItem.items) {
          newItem.items = newItem.items.map((subItem) => {
            const isActive = subItem.url === pathName;
            if (isActive) {
              setActivePath({ ...subItem, parentTitle: newItem.title });
            }
            return {
              ...subItem,
              isActive,
            };
          });
        }

        return newItem;
      });

      setSideBarData({ navMain: s || [] });

      // const p = data.navMain.filter((item) =>
      //   item.items?.some((subItem) => subItem.url === pathName)
      // );

      // Set the active path based on the current pathname

      // setActivePath(p[0] || null);
    }
  }, [pathName, mounted, data, setActivePath]);

  return (
    <>
      <SidebarProvider>
        <Sidebar side={i18n.language === "ar" ? "right" : "left"}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="#">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Documentation</span>
                      <span className="">v1.0.0</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <Input
                icon={SearchIcon}
                className="h-7"
                iconPosition="right"
                placeholder="Find element"
              />
            </SidebarGroup>
            <SidebarGroup>
              <SidebarMenu>
                {sideBarData &&
                  sideBarData.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="font-medium">
                          {/* Show plain text during SSR, and translated text only after mounting */}
                          {item.icon && (
                            <IconComponent
                              iconName={item.icon}
                              color="#aaa"
                              className=""
                            />
                          )}
                          {mounted ? t(item.title) : item.title}
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <SidebarMenuSub>
                          {" "}
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                              
                                asChild
                                // isActive={item.isActive}
                                className={
                                  item.isActive
                                    ? "bg-sidebar-primary hover:bg-sidebar-primary text-sidebar-primary-foreground hover:text-sidebar-primary-foreground"
                                    : ""
                                }
                              >
                                <Link
                                  href={item.url}
                                  className="flex items-center gap-2"
                                >
                                  {item.icon && (
                                    <IconComponent
                                      iconName={item.icon}
                                      color={item.isActive ? "#fff" : "#aaa"}
                                      className=""
                                    />
                                  )}
                                  {/* Show plain text during SSR, and translated text only after mounting */}
                                  {mounted ? t(item.title) : item.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage src="/next.svg" alt="photo" />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Tamer</span>
                        <span className="truncate text-xs text-muted-foreground">
                          tamer.osman@live.com
                        </span>
                      </div>
                      <MoreVerticalIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src="/next.svg" alt="photo" />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">name</span>
                          <span className="truncate text-xs text-muted-foreground">
                            title
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <UserCircleIcon />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={"/userAccountSettings/changeLanguage"}
                          className="flex items-center gap-2"
                        >
                          <LanguagesIcon />
                          Language
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCardIcon />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BellIcon />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOutIcon />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>         
{/*           
           <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      {activePath?.parentTitle || ""}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t(activePath?.title) || ""}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 pr-4">
              <ThemeSwitcher />
               <LanguageSwitcher />
            </div>
            
            
          </header> */}
          <main className="container mx-auto"  dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        
            
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* <nav className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-900 flex justify-between items-center">
      <div className="font-bold text-xl">NextJS i18n</div>
       */}

      {/* </nav> */}
    </>
  );
};

export default Navigation;
