"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useParams } from "next/navigation";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useState } from "react";
export default function Page() {
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
  }, [i18n.language])
    const { empcode } = useParams
    ();
  
  return (

<div 
  className="min-h-screen flex items-center justify-center p-4 md:p-8"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  }}
>
  <div className="w-full max-w-4xl bg-opacity-90 rounded-lg">
    <div className="p-6 md:p-8 space-y-6">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-100">{t("hrHelpDeskTitle")}</h1>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          {t("hrHelpDeskDescription")}
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
        <Link href={`/${empcode}/question`} passHref>
          <Button
            className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
                      text-lg font-medium w-full md:w-auto min-w-[240px] transition-colors"
          >
            {t("askQuestion")}
          </Button>
        </Link>
        <Link href={`/${empcode}/hr_document`} passHref>
          <Button 
            className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
                      text-lg font-medium w-full md:w-auto min-w-[240px]"
          >
            {t("requestDocument")}
          </Button>
        </Link>
      </div>
    </div>
  </div>
</div>




  )
}

{/* <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
  <div className="w-full max-w-4xl bg-image rounded-lg shadow-lg overflow-hidden">
    <div className="p-6 md:p-8 space-y-6">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">HR Help Desk</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          You can ask any HR-related question or request an HR document by clicking 
          the buttons below. Our team is ready to assist you with all your HR needs.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
      <Link href="/question" passHref>
  <Button
    className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
              text-lg font-medium w-full md:w-auto min-w-[240px] transition-colors"
  >
    Ask a Question
  </Button>
</Link>
<Link href="/hr_document" passHref>

        <Button 
          className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
                    text-lg font-medium w-full md:w-auto min-w-[240px] "
        >
          Request Document
        </Button></Link>
      </div>
    </div>
  </div>
</div> */}