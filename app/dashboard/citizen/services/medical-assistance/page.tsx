"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  FileText,
  User,
  Heart,
  DollarSign,
  Loader2,
} from "lucide-react";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

// sessionStorage key used to hold a draft of the text fields while the
// user is sent to /login and back. The supporting-document File is NOT
// saved here (File objects aren't JSON-serializable) — only text fields
// survive, and the user is asked to re-attach the file after logging in.
const DRAFT_KEY = "medical-assistance-draft";

type FormDataShape = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  age: string;
  sex: string;
  diagnosis: string;
  hospitalName: string;
  doctorName: string;
  estimatedCost: string;
  monthlyIncome: string;
  assistanceAmountRequested: string;
};

export default function MedicalAssistancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [formData, setFormData] = useState<FormDataShape>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    age: "",
    sex: "",
    diagnosis: "",
    hospitalName: "",
    doctorName: "",
    estimatedCost: "",
    monthlyIncome: "",
    assistanceAmountRequested: "",
  });
  const [supportingDocuments, setSupportingDocuments] = useState<File | null>(
    null,
  );

  // On mount: try to silently prefill from a logged-in profile (no redirect
  // if there isn't one — guests can fill out the whole form), then restore
  // any draft left behind from a previous "please log in" trip.
  useEffect(() => {
    const init = async () => {
      try {
        const user = await authClient.getCurrentUser();

        if (user) {
          let calculatedAge = "";
          if (user.birth_date) {
            const birthDate = new Date(user.birth_date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            calculatedAge = age.toString();
          }

          setFormData((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone_number || "",
            address: user.address || "",
            birthDate: user.birth_date || "",
            age: calculatedAge,
            sex: user.sex || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }

      // Restore a draft saved before a login redirect, if any. This takes
      // priority over the profile prefill above since it reflects what the
      // user actually typed.
      try {
        const saved = sessionStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed: FormDataShape = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
          sessionStorage.removeItem(DRAFT_KEY);

          toast({
            title: "Draft restored",
            description:
              "We saved what you filled in before you logged in. Please re-attach your supporting document, then submit again.",
          });
        }
      } catch (err) {
        console.error("Failed to restore medical assistance draft:", err);
      }

      setIsLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: keyof FormDataShape, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate age when birth date changes
      if (field === "birthDate" && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        updated.age = age.toString();
      }

      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSupportingDocuments(e.target.files[0]);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // 🔒 Auth check happens HERE — only when the user clicks "Submit Application".
    const currentUser = await authClient.getCurrentUser();
    if (!currentUser) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error("Failed to save medical assistance draft:", err);
      }

      toast({
        title: "Please log in to submit",
        description:
          "Your answers are saved — just log in and we'll bring you right back.",
      });

      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (supportingDocuments) {
        formDataToSend.append("supportingDocuments", supportingDocuments);
      }

      const response = await fetch("/api/medical-assistance", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        toast({
          title: "Server Error",
          description: "Invalid response format. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 401) {
        // Session expired between the check above and the actual submit —
        // save the draft the same way so nothing is lost.
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch (err) {
          console.error("Failed to save medical assistance draft:", err);
        }

        toast({
          title: "Session Expired",
          description:
            "Please log in again to continue. Your answers are saved.",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }, 2000);
        return;
      }

      if (response.ok) {
        setReferenceNumber(data.data.reference_number);
        setSubmitSuccess(true);
        sessionStorage.removeItem(DRAFT_KEY);
        toast({
          title: "Success!",
          description:
            "Your medical assistance application has been submitted.",
        });
      } else {
        toast({
          title: "Application Failed",
          description: data.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error instanceof TypeError && error.message.includes("Failed to fetch")
          ? "Network connection error. Please check your internet connection."
          : "An unexpected error occurred. Please try again.";

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CitizenLayout requireAuth={false}>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </CitizenLayout>
    );
  }

  if (submitSuccess) {
    return (
      <CitizenLayout requireAuth={false}>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Your medical assistance application has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-rose-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                <p className="text-xl font-bold text-rose-600">
                  {referenceNumber}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Please save this reference number for tracking your application
                status.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() =>
                    router.push("/dashboard/citizen/account/applications")
                  }
                  className="w-full"
                >
                  View My Applications
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  Submit Another Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CitizenLayout>
    );
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Medical Info", icon: Heart },
    { number: 3, title: "Financial Info", icon: DollarSign },
    { number: 4, title: "Documents", icon: FileText },
    { number: 5, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <CitizenLayout requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Medical Assistance Application
            </h1>
            <p className="text-gray-600">
              Apply for financial assistance for medical expenses
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ You can fill this out now and log in only when you're ready to
              submit. If you're already logged in, we've pre-filled what we can
              from your account.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.number
                          ? "bg-rose-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 text-gray-600">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${currentStep > step.number ? "bg-rose-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep} of 5</CardTitle>
              <CardDescription>{steps[currentStep - 1].title}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Juan Dela Cruz"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="juan@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="09123456789"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        max={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        placeholder="25"
                        required
                        readOnly={!!formData.birthDate}
                      />
                      {formData.birthDate && (
                        <p className="text-xs text-gray-500">
                          Auto-calculated from birth date
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Sex *</Label>
                      <Select
                        value={formData.sex}
                        onValueChange={(value) =>
                          handleInputChange("sex", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="House No., Street, Barangay, City, Province"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Medical Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">
                      Diagnosis/Medical Condition *
                    </Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        handleInputChange("diagnosis", e.target.value)
                      }
                      placeholder="Describe the medical condition or diagnosis"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">
                        Hospital/Clinic Name *
                      </Label>
                      <Input
                        id="hospitalName"
                        value={formData.hospitalName}
                        onChange={(e) =>
                          handleInputChange("hospitalName", e.target.value)
                        }
                        placeholder="Name of hospital or clinic"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Doctor's Name *</Label>
                      <Input
                        id="doctorName"
                        value={formData.doctorName}
                        onChange={(e) =>
                          handleInputChange("doctorName", e.target.value)
                        }
                        placeholder="Attending physician"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">
                      Estimated Medical Cost (₱) *
                    </Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      value={formData.estimatedCost}
                      onChange={(e) =>
                        handleInputChange("estimatedCost", e.target.value)
                      }
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">
                      Monthly Family Income (₱) *
                    </Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) =>
                        handleInputChange("monthlyIncome", e.target.value)
                      }
                      placeholder="15000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assistanceAmountRequested">
                      Assistance Amount Requested (₱) *
                    </Label>
                    <Input
                      id="assistanceAmountRequested"
                      type="number"
                      value={formData.assistanceAmountRequested}
                      onChange={(e) =>
                        handleInputChange(
                          "assistanceAmountRequested",
                          e.target.value,
                        )
                      }
                      placeholder="20000"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supportingDocuments">
                      Supporting Documents
                    </Label>
                    <Input
                      id="supportingDocuments"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-sm text-gray-500">
                      Upload medical certificates, prescriptions, or hospital
                      bills (PDF, JPG, PNG - Max 10MB)
                    </p>
                    {supportingDocuments && (
                      <p className="text-sm text-green-600">
                        File selected: {supportingDocuments.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Note: if you're not logged in yet, you'll need to
                      re-select this file after logging in — it can't be carried
                      across the login step.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Full Name:</span>
                        <p className="font-medium">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Birth Date:</span>
                        <p className="font-medium">{formData.birthDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Age:</span>
                        <p className="font-medium">{formData.age}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sex:</span>
                        <p className="font-medium capitalize">{formData.sex}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Medical Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Diagnosis:</span>
                        <p className="font-medium">{formData.diagnosis}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-600">Hospital:</span>
                          <p className="font-medium">{formData.hospitalName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Doctor:</span>
                          <p className="font-medium">{formData.doctorName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Cost:</span>
                          <p className="font-medium">
                            ₱{formData.estimatedCost}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Income:</span>
                        <p className="font-medium">₱{formData.monthlyIncome}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Assistance Requested:
                        </span>
                        <p className="font-medium">
                          ₱{formData.assistanceAmountRequested}
                        </p>
                      </div>
                    </div>
                  </div>

                  {supportingDocuments && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Documents</h3>
                      <p className="text-sm">
                        File: {supportingDocuments.name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 5 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CitizenLayout>
  );
}
