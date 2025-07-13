
"use client";

import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
const faqItems = [
  {
    id: "item-1",
    question: "When will I receive my Debit Card?",
    answer: "You will receive your Debit Card within 7–10 business days after account activation.",
    category: "payroll"
  },
  {
    id: "item-2",
    question: "What is the status of my medical reimbursement?",
    answer: "You can check your medical reimbursement status in the 'My Claims' section on the HR portal.",
    category: "medical"
  },
  {
    id: "item-3",
    question: "How can I reset my password?",
    answer: "You can reset your password through the 'Forgot Password' link on the login page.",
    category: "technical"
  },
  {
    id: "item-4",
    question: "How can I view my payslip?",
    answer: "Payslips are available in the Payroll section of the employee portal.",
    category: "payroll"
  },
  {
    id: "item-5",
    question: "What benefits do I have with Khazna?",
    answer: "Khazna offers a range of financial wellness tools including salary advances, savings, and more.",
    category: "benefits"
  },
  {
    id: "item-6",
    question: "How can I apply for an internal vacancy?",
    answer: "You can apply through the internal job portal accessible via the HR system.",
    category: "career"
  },
  {
    id: "item-7",
    question: "How can employees without PC/Laptop access company policies?",
    answer: "Employees can access policies via the mobile HR app or request printed copies from HR.",
    category: "access"
  },
  {
    id: "item-8",
    question: "What is the maximum amount of coverage of our medical insurance?",
    answer: "Coverage limits vary by plan. Please refer to the insurance policy document in the portal.",
    category: "medical"
  },
  {
    id: "item-9",
    question: "What is the career progression of my current role?",
    answer: "Career progression details are available in the Career Development section of the portal.",
    category: "career"
  }
];


export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
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
  const {empcode}=useParams();
  const filteredItems = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="w-full h-auto m-4 bg-gray-100 opacity-80 rounded-lg shadow-lg overflow-hidden grid grid-rows">
        <div className="items-center justify-center m-6">
          <h1 className="text-center text-3xl font-bold">{t("faq.title")}</h1>

          <div className="items-center justify-center m-6">
            <Input
              placeholder={t("faq.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-[1500px] mb-6 flex md:items-center justify-center"
            />

            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500">{t("faq.noResults")}</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      {t(`faq.items.${item.id}.question`)}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t(`faq.items.${item.id}.answer`)}
                      <div className="mt-2 text-sm text-gray-500">
                        {t("faq.category")}: {t(`faq.items.${item.id}.category`)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  