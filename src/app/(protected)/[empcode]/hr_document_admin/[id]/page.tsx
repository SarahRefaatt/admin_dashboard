"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "lucide-react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
type Request = {
  id: string;
  employeeId: string;
  empId: string;
  status: string;
  reply: string;
  requestType: string;
  description?: string;
  emp?: {
    name: string;
    employeeId: string;
    email: string;
    department: string;
    position: string;
    phoneNumber: string;
  };
  documentUrl: string;
  replyDocumentUrl: string;
};


type Employee = {
 name: string;
    employeeId: string;
    email: string;
    department: string;
    position: string;
    phoneNumber: string;
};

type RequestHistory = {
  id: string;
  requestId: string;
  assignedto: string;
  assignedBy: string; 
}

export default function RequestDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);

  const { empcode } = useParams<{ empcode: string }>();
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

  console.log("empcode", empcode);
  const [formData, setFormData] = useState<Partial<Request>>({
    status: "PENDING",
    reply: "",
  });
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitmsg, setSubmitMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const [employee, setEmployee] = useState<Employee | null >(null)

  const [requestHistory, setRequestHistory] = useState<RequestHistory | null>(null);
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setProgress(30);
        const empResponse = await fetch(`/api/emps?employeeId=${empcode}`)
        const empdata = await empResponse.json();

        const req_hist_response = await fetch(`/api/req_history?id=${id}`); 
        const req_hist_data = await req_hist_response.json();
        if (!req_hist_response.ok) throw new Error("Failed to fetch request history");
        setRequestHistory(req_hist_data);
        console.log("request history", req_hist_data);

        setEmployee(empdata[0]);
        const response = await fetch(`/api/reqs?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch request details");
        setProgress(70);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCurrentRequest(data[0]);
          setFormData({
            status: data[0].status || "PENDING",
            reply: data[0].reply || "",
            // empId: data[0].empId || { empcode },
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : `Failed to load request `
        );
      } finally {
        setProgress(100);
        setLoading(false);
      }
    };

    if (id) fetchRequestDetails();
  }, [id, empcode]);

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


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);
    setError(null);
    setUploadStatus(null);
    setSubmitSuccess(false);
    setSubmitMsg(false);

    // // Basic validation
    // if (!formData.title.trim() || !formData.description.trim() || !formData.requestType) {
    //     setError('Please fill in all required fields');
    //     setIsSubmitting(false);
    //     setIsUploading(false);
    //     return;
    // }

    let uploadedFileUrl = fileUrl; // Use existing fileUrl if no new file is uploaded

    // Handle file upload if a new file is selected
    if (file) {
        // const uploadData = new FormData();
        
        // uploadData.append('file', file);
         const uploadData = new FormData();
      // If you need to change the file name, create a new File object (optional)
      const renamedFile = new File([file], `/admin/${empcode}/${currentRequest?.emp?.employeeId}/${file.name}`, {
        type: file.type,
      });
      uploadData.append("file", renamedFile);


        try {
            const uploadResponse = await fetch(`/api/upload`, {
                method: 'POST',
                body: uploadData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadResult.message || 'File upload failed');
            }

            uploadedFileUrl = uploadResult;
            setFileUrl(uploadedFileUrl);
            setUploadStatus({
                success: true,
                message: 'File uploaded successfully!',
            });
            setFile(null);
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            setUploadStatus({
                success: false,
                message: uploadError instanceof Error ? uploadError.message : 'File upload failed',
            });
            setIsSubmitting(false);
            setIsUploading(false);
            return;
        }
    }

    try {
        // Update the request with the final data (including uploaded file URL if available)
        const updateResponse = await fetch(
            `/api/reqs2?id=${id}&currEmpId=${empcode}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    replyDocumentUrl: uploadedFileUrl,
                    // assignedId: empcode,
                    // id,
                }),
            }
        );

        if (!updateResponse.ok) {
            throw new Error(`Failed to update request ${empcode}`);
        }

        setSubmitSuccess(true);

        // Send notification if needed (assuming this is for status updates)
        if (formData.status) { // Only send if status is being updated
            try {
                console.log("Sending notification...");
                const notificationResponse = await fetch("/api/proxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({
                        phoneNumber: "201099013212",
                        text: `Hi ${currentRequest?.emp?.name}, your request with Code ${id} has been updated to ${formData.status}.\nLink: https://hrhelpdesk-sig6.vercel.app//${currentRequest?.emp?.employeeId}/hr_document/${id}`,
                    }),
                });

                if (!notificationResponse.ok) {
                    throw new Error(`Failed to send notification`);
                }

                setSubmitMsg(true);
            } catch (notificationError) {
                console.error("Notification error:", notificationError);
                // Continue even if notification fails
            }
        }

        // Redirect after successful submission
        setTimeout(() => router.push(`/${empcode}/${id}/done_request`), 1500);
    } catch (err) {
        console.error("Error updating request: ", err);
        setError(
            err instanceof Error ? err.message : "An unknown error occurred"
        );
    } finally {
        setIsSubmitting(false);
        setIsUploading(false);
    }
};
 
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Set default name only if name field is empty

    }
  };
 

  return (
    <div
  className="min-h-screen flex items-center justify-center p-4 md:p-8"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
  <div className="bg-white rounded-2xl opacity-90 p-6 md:p-10 m-3 w-full max-w-4xl shadow-xl">
    <h1 className="text-3xl font-serif text-center text-gray-800 font-bold mb-8">
      {t("requestDetails")}
    </h1>

    {/* Request Information Section */}
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {t("requestSummary")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-600">{t("requesterName")}</Label>
          <p className="font-medium">{currentRequest?.emp?.name}</p>
        </div>
        <div>
          <Label className="text-gray-600">{t("requesterDepartment")}</Label>
          <p className="font-medium">{currentRequest?.emp?.department}</p>
        </div>
        <div>
          <Label className="text-gray-600">{t("requesterId")}</Label>
          <p className="font-medium">{currentRequest?.emp?.employeeId}</p>
        </div>
        <div>
          <Label className="text-gray-600">{t("requesterPosition")}</Label>
          <p className="font-medium">
            {currentRequest?.emp?.position || "N/A"}
          </p>
        </div>
        <div>
          <Label className="text-gray-600">{t("requestType")}</Label>
          <p className="font-medium">
            {currentRequest?.requestType || "N/A"}
          </p>
        </div>
        <div>
          <Label className="text-gray-600">{t("currentStatus")}</Label>
          <p className="font-medium">{currentRequest?.status || "N/A"}</p>
        </div>
        <div className="">
          <Label className="text-gray-600">{t("attachedDocument")}</Label>
          {currentRequest?.documentUrl ? (
            <a
              href={currentRequest.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:underline"
            >
              <Link className="mr-2" size={16} />
              {currentRequest.documentUrl.split("/").pop()}
            </a>
          ) : (
            <p className="font-medium text-gray-500">N/A</p>
          )}
        </div>
        {currentRequest?.description && (
          <div className="md:col-span-2">
            <Label className="text-gray-600">{t("description")}</Label>
            <p className="font-medium">{currentRequest.description}</p>
          </div>
        )}
      </div>
    </div>

    {/* Update Form Section */}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
     <div className="relative w-full">
  <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
    {t("updateStatus")}
  </label>
  <div className="relative">
    <select
      id="status"
      name="status"
      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
      value={formData.status}
      onChange={handleChange}
      required
    >
      <option value="PENDING">{t("pending")}</option>
      <option value="COMPLETED">{t("completed")}</option>
      <option value="REJECTED">{t("rejected")}</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
      </svg>
    </div>
  </div>
</div>


        <div>
          <Label htmlFor="reply" className="text-gray-700">
            {t("adminReply")}
          </Label>
          <textarea
            id="reply"
            name="reply"
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-green-700 focus:outline-none"
            placeholder={t("enterReply")}
            rows={4}
            value={formData.reply || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="file">{t("selectFile")}</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          {uploadStatus && (
            <p
              className={`text-sm ${
                uploadStatus.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {uploadStatus.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {submitSuccess && (
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          {t("requestUpdated")}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="py-3 px-6 rounded-xl"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </Button>

        {employee?.employeeId === requestHistory?.assignedto && (
          <Button
            type="submit"
            className="bg-green-700 hover:bg-green-600 py-3 px-6 rounded-xl text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("updating") : t("updateRequest")}
          </Button>
        )}
      </div>
    </form>
  </div>
</div>
  );
}
