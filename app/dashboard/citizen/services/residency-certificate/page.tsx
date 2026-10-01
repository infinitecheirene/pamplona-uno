"use client";

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
import { CheckCircle2, FileText, User, Home, AlertCircle } from "lucide-react";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

// sessionStorage key used to hold a draft of the text fields while the
// user is sent to /login and back. The validId / proofOfResidency Files
// are NOT saved here (File objects aren't JSON-serializable) — only text
// fields survive, and the user is asked to re-attach files after login.
const DRAFT_KEY = "residency-certificate-draft";

type FormDataShape = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  age: string;
  sex: string;
  civilStatus: string;
  yearsOfResidency: string;
  barangay: string;
  occupation: string;
  purpose: string;
};

export default function ResidencyCertificatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormDataShape>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    age: "",
    sex: "",
    civilStatus: "",
    yearsOfResidency: "",
    barangay: "",
    occupation: "",
    purpose: "",
  });
  const [validId, setValidId] = useState<File | null>(null);
  const [proofOfResidency, setProofOfResidency] = useState<File | null>(null);

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

          let barangayValue = "";
          if (user.address) {
            const addressParts = user.address.split(",");
            if (addressParts.length >= 2) {
              barangayValue =
                addressParts[addressParts.length - 3]?.trim() || "";
            }
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
            civilStatus: user.civil_status || "",
            barangay: barangayValue,
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
              "We saved what you filled in before you logged in. Please re-attach your ID and documents, then submit again.",
          });
        }
      } catch (err) {
        console.error("Failed to restore residency certificate draft:", err);
      }

      setIsLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: keyof FormDataShape, value: string) => {
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
      setFormData((prev) => ({ ...prev, [field]: value, age: age.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setErrorMessage("");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "validId" | "proofOfResidency",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB");
        e.target.value = "";
        return;
      }

      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please upload a PDF, JPG, or PNG file");
        e.target.value = "";
        return;
      }

      if (field === "validId") {
        setValidId(file);
      } else {
        setProofOfResidency(file);
      }
      setErrorMessage("");
    }
  };

  const validateStep = () => {
    setErrorMessage("");

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage("Full name is required");
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage("Valid email is required");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMessage("Phone number is required");
        return false;
      }
      if (!formData.birthDate) {
        setErrorMessage("Birth date is required");
        return false;
      }

      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate > today) {
        setErrorMessage("Birth date cannot be in the future");
        return false;
      }

      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 18);
      if (birthDate > minDate) {
        setErrorMessage("Applicant must be at least 18 years old");
        return false;
      }

      if (!formData.age || parseInt(formData.age) < 18) {
        setErrorMessage("Applicant must be at least 18 years old");
        return false;
      }

      if (!formData.sex) {
        setErrorMessage("Sex is required");
        return false;
      }
      if (!formData.civilStatus) {
        setErrorMessage("Civil status is required");
        return false;
      }
      if (!formData.address.trim()) {
        setErrorMessage("Complete address is required");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.barangay.trim()) {
        setErrorMessage("Barangay is required");
        return false;
      }
      if (
        !formData.yearsOfResidency ||
        parseInt(formData.yearsOfResidency) < 0
      ) {
        setErrorMessage("Years of residency is required");
        return false;
      }
      if (!formData.purpose.trim()) {
        setErrorMessage("Purpose is required");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!validId) {
        setErrorMessage("Valid ID is required");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      toast({
        title: "Step Complete",
        description: `You're on step ${currentStep + 1} of 4`,
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    // 🔒 Auth check happens HERE — only when the user clicks "Submit Application".
    const currentUser = await authClient.getCurrentUser();
    if (!currentUser) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error("Failed to save residency certificate draft:", err);
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
    setErrorMessage("");

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("birthDate", formData.birthDate);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("sex", formData.sex);
      formDataToSend.append("civilStatus", formData.civilStatus);
      formDataToSend.append("yearsOfResidency", formData.yearsOfResidency);
      formDataToSend.append("barangay", formData.barangay);
      formDataToSend.append("occupation", formData.occupation);
      formDataToSend.append("purpose", formData.purpose);

      if (validId) {
        formDataToSend.append("validId", validId);
      }
      if (proofOfResidency) {
        formDataToSend.append("proofOfResidency", proofOfResidency);
      }

      const response = await fetch("/api/residency-certificate", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.status === 401) {
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch (err) {
          console.error("Failed to save residency certificate draft:", err);
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

      if (response.ok && data.success) {
        setReferenceNumber(data.data.reference_number);
        setSubmitSuccess(true);
        sessionStorage.removeItem(DRAFT_KEY);
        toast({
          title: "Success!",
          description:
            "Your residency certificate application has been submitted.",
        });
      } else {
        let errorMsg = data.message || "Failed to submit application";
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ");
          errorMsg = errorMessages;
        }

        setErrorMessage(errorMsg);
        toast({
          title: "Application Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error instanceof TypeError && error.message.includes("Failed to fetch")
          ? "Network connection error. Please check your internet connection."
          : "Unable to connect to server. Please try again.";

      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <CitizenLayout requireAuth={false}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Your residency certificate application has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                <p className="text-xl font-bold text-green-600">
                  {referenceNumber}
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="text-sm font-semibold text-teal-900 mb-2">
                  What's Next?
                </p>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• Your application will be reviewed by the admin</li>
                  <li>• You can track status in your dashboard</li>
                  <li>• You'll be notified when it's approved</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Please save this reference number for tracking your application
                status.
              </p>
              <Button
                onClick={() => router.push("/dashboard/citizen")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </CitizenLayout>
    );
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Residency Info", icon: Home },
    { number: 3, title: "Documents", icon: FileText },
    { number: 4, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <CitizenLayout requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Residency Certificate Application
            </h1>
            <p className="text-gray-600">
              Apply for your certificate of residency
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            currentStep >= step.number
                              ? "bg-green-600 text-white"
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
                          className={`h-1 flex-1 mx-2 ${currentStep > step.number ? "bg-green-600" : "bg-gray-200"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Step {currentStep} of 4</CardTitle>
                  <CardDescription>
                    {steps[currentStep - 1].title}
                  </CardDescription>
                  {currentStep === 1 && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ℹ️ You can fill this out now and log in only when you're
                        ready to submit. If you're already logged in, we've
                        pre-filled what we can from your account.
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                  )}

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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) =>
                              handleInputChange("age", e.target.value)
                            }
                            placeholder="18"
                            min="18"
                            max="150"
                            required
                            disabled={!!formData.birthDate}
                          />
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
                        <div className="space-y-2">
                          <Label htmlFor="civilStatus">Civil Status *</Label>
                          <Select
                            value={formData.civilStatus}
                            onValueChange={(value) =>
                              handleInputChange("civilStatus", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="separated">
                                Separated
                              </SelectItem>
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

                  {/* Step 2: Residency Information */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="barangay">Barangay *</Label>
                          <Input
                            id="barangay"
                            value={formData.barangay}
                            onChange={(e) =>
                              handleInputChange("barangay", e.target.value)
                            }
                            placeholder="Barangay name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsOfResidency">
                            Years of Residency *
                          </Label>
                          <Input
                            id="yearsOfResidency"
                            type="number"
                            value={formData.yearsOfResidency}
                            onChange={(e) =>
                              handleInputChange(
                                "yearsOfResidency",
                                e.target.value,
                              )
                            }
                            placeholder="5"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="occupation">
                          Occupation (Optional)
                        </Label>
                        <Input
                          id="occupation"
                          value={formData.occupation}
                          onChange={(e) =>
                            handleInputChange("occupation", e.target.value)
                          }
                          placeholder="e.g., Teacher, Employee, Self-employed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose">
                          Purpose of Certificate *
                        </Label>
                        <Textarea
                          id="purpose"
                          value={formData.purpose}
                          onChange={(e) =>
                            handleInputChange("purpose", e.target.value)
                          }
                          placeholder="e.g., School Requirements, Employment, Business Permit, Bank Requirements, etc."
                          rows={4}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Please specify the reason why you need this
                          certificate
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="validId">Valid ID *</Label>
                        <Input
                          id="validId"
                          type="file"
                          onChange={(e) => handleFileChange(e, "validId")}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        <p className="text-sm text-gray-500">
                          Upload a copy of your valid ID (PDF, JPG, PNG - Max
                          10MB)
                        </p>
                        {validId && (
                          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-800">
                              File selected: {validId.name}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          Note: if you're not logged in yet, you'll need to
                          re-select this file after logging in — it can't be
                          carried across the login step.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proofOfResidency">
                          Proof of Residency (Optional)
                        </Label>
                        <Input
                          id="proofOfResidency"
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "proofOfResidency")
                          }
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <p className="text-sm text-gray-500">
                          Upload supporting documents like utility bills, lease
                          contract, etc. (Optional)
                        </p>
                        {proofOfResidency && (
                          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-800">
                              File selected: {proofOfResidency.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
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
                            <p className="font-medium capitalize">
                              {formData.sex}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Civil Status:</span>
                            <p className="font-medium capitalize">
                              {formData.civilStatus}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium">{formData.address}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">
                          Residency Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Barangay:</span>
                            <p className="font-medium">{formData.barangay}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Years of Residency:
                            </span>
                            <p className="font-medium">
                              {formData.yearsOfResidency} years
                            </p>
                          </div>
                          {formData.occupation && (
                            <div>
                              <span className="text-gray-600">Occupation:</span>
                              <p className="font-medium">
                                {formData.occupation}
                              </p>
                            </div>
                          )}
                          <div className="col-span-2">
                            <span className="text-gray-600">Purpose:</span>
                            <p className="font-medium">{formData.purpose}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">
                          Documents
                        </h3>
                        <div className="space-y-2 text-sm">
                          {validId && <p>Valid ID: {validId.name}</p>}
                          {proofOfResidency && (
                            <p>Proof of Residency: {proofOfResidency.name}</p>
                          )}
                        </div>
                      </div>
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
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
}
