"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  User,
  FileText,
  Users,
  ClipboardCheck,
} from "lucide-react";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

// sessionStorage key used to hold a draft of the form while the user is
// sent to /login and back. Everything here is plain text/JSON-safe, so
// the whole formData object (no files in this form) can be saved as-is.
const DRAFT_KEY = "barangay-blotter-draft";

type DraftShape = {
  step: number;
  formData: {
    fullName: string;
    email: string;
    age: string;
    gender: string;
    address: string;
    contactNumber: string;
    incidentType: string;
    incidentDate: string;
    incidentTime: string;
    incidentLocation: string;
    narrative: string;
    complaintAgainst: string;
    witness1Name: string;
    witness1Contact: string;
    witness2Name: string;
    witness2Contact: string;
  };
};

export default function BarangayBlotterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    contactNumber: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    narrative: "",
    complaintAgainst: "",
    witness1Name: "",
    witness1Contact: "",
    witness2Name: "",
    witness2Contact: "",
  });

  useEffect(() => {
    const init = async () => {
      // 1. Restore a saved draft first (means the user just came back
      // from /login mid-way through the form).
      let restoredFromDraft = false;
      try {
        const saved = sessionStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed: DraftShape = JSON.parse(saved);
          setFormData(parsed.formData);
          setCurrentStep(parsed.step || 1);
          sessionStorage.removeItem(DRAFT_KEY);
          restoredFromDraft = true;

          toast({
            title: "Draft restored",
            description:
              "We saved your answers before you logged in. Please review and continue.",
          });
        }
      } catch (err) {
        console.error("Failed to restore barangay blotter draft:", err);
      }

      // 2. Auto-fill from profile if logged in (skip if we just restored
      // a draft, so we don't overwrite what the user already typed).
      try {
        const user = await authClient.getCurrentUser();
        if (user && !restoredFromDraft) {
          setFormData((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            address: user.address || "",
            contactNumber: user.phone_number || "",
            gender: user.sex || "",
          }));
          toast({
            title: "Welcome",
            description: "Your profile information has been auto-filled.",
          });
        }
        // If no user: leave the form blank/editable. Login is only
        // required later, at final submit.
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setUserLoaded(true);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        formData.fullName &&
        formData.email &&
        formData.age &&
        formData.gender &&
        formData.address &&
        formData.contactNumber
      );
    }
    if (step === 2) {
      return !!(
        formData.incidentType &&
        formData.incidentDate &&
        formData.incidentTime &&
        formData.incidentLocation &&
        formData.complaintAgainst &&
        formData.narrative
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    const draft: DraftShape = { step: currentStep, formData };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (err) {
      console.error("Failed to save barangay blotter draft:", err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 🔒 Auth check happens HERE — only when the user clicks "Submit
    // Report" on the final review step.
    const currentUser = await authClient.getCurrentUser();
    if (!currentUser) {
      saveDraft();
      toast({
        title: "Please log in to submit",
        description:
          "Your answers are saved — just log in and we'll bring you right back.",
      });
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/barangay-blotter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        // Session expired between page load and submit.
        saveDraft();
        toast({
          title: "Session Expired",
          description: "Please log in again — your answers are saved.",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit blotter");
      }

      setSuccess(true);
      sessionStorage.removeItem(DRAFT_KEY);
      toast({
        title: "Success",
        description: "Your blotter report has been submitted successfully.",
      });

      setTimeout(() => {
        setSuccess(false);
        setCurrentStep(1);
        setFormData({
          fullName: "",
          email: "",
          age: "",
          gender: "",
          address: "",
          contactNumber: "",
          incidentType: "",
          incidentDate: "",
          incidentTime: "",
          incidentLocation: "",
          narrative: "",
          complaintAgainst: "",
          witness1Name: "",
          witness1Contact: "",
          witness2Name: "",
          witness2Contact: "",
        });
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Incident Details", icon: FileText },
    { number: 3, title: "Witnesses", icon: Users },
    { number: 4, title: "Review", icon: ClipboardCheck },
  ];

  if (!userLoaded) {
    return (
      <CitizenLayout requireAuth={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </CitizenLayout>
    );
  }

  if (success) {
    return (
      <CitizenLayout requireAuth={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">
                Blotter Report Submitted!
              </CardTitle>
              <CardDescription>
                Your incident report has been successfully filed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Returning you to the form shortly...
              </p>
            </CardContent>
          </Card>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Barangay Blotter
            </h1>
            <p className="text-gray-600">
              File an incident report with your barangay
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
                          ? "bg-blue-600 text-white"
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
                      className={`h-1 flex-1 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep} of 4</CardTitle>
              <CardDescription>{steps[currentStep - 1].title}</CardDescription>
              {currentStep === 1 && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ Your information has been pre-filled from your account.
                    You can edit any field if needed.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
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
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Juan Dela Cruz"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="juan@example.com"
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
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter age"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                        required
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Incident Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="incidentType">Incident Type *</Label>
                    <Select
                      value={formData.incidentType}
                      onValueChange={(value) =>
                        handleSelectChange("incidentType", value)
                      }
                      required
                    >
                      <SelectTrigger id="incidentType">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="disturbance">Disturbance</SelectItem>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="property_damage">
                          Property Damage
                        </SelectItem>
                        <SelectItem value="lost_found">Lost & Found</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Date of Incident *</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        name="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incidentTime">Time of Incident *</Label>
                      <Input
                        id="incidentTime"
                        type="time"
                        name="incidentTime"
                        value={formData.incidentTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incidentLocation">
                      Location of Incident *
                    </Label>
                    <Input
                      id="incidentLocation"
                      type="text"
                      name="incidentLocation"
                      value={formData.incidentLocation}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter incident location"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaintAgainst">
                      Complaint Against *
                    </Label>
                    <Input
                      id="complaintAgainst"
                      type="text"
                      name="complaintAgainst"
                      value={formData.complaintAgainst}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Name of person involved (if known)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="narrative">Narrative / Description *</Label>
                    <Textarea
                      id="narrative"
                      name="narrative"
                      value={formData.narrative}
                      onChange={handleInputChange}
                      placeholder="Describe the incident in detail..."
                      rows={5}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Witnesses */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Witness 1
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness1Name">Name</Label>
                        <Input
                          id="witness1Name"
                          type="text"
                          name="witness1Name"
                          value={formData.witness1Name}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Witness name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="witness1Contact">Contact Number</Label>
                        <Input
                          id="witness1Contact"
                          type="tel"
                          name="witness1Contact"
                          value={formData.witness1Contact}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Contact number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Witness 2
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness2Name">Name</Label>
                        <Input
                          id="witness2Name"
                          type="text"
                          name="witness2Name"
                          value={formData.witness2Name}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Witness name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="witness2Contact">Contact Number</Label>
                        <Input
                          id="witness2Contact"
                          type="tel"
                          name="witness2Contact"
                          value={formData.witness2Contact}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Contact number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      Witness information helps us better document the incident.
                      You may leave blank if no witnesses.
                    </p>
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
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Age:</span>
                        <p className="font-medium">{formData.age}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Gender:</span>
                        <p className="font-medium capitalize">
                          {formData.gender}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <p className="font-medium">{formData.contactNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Incident Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium capitalize">
                          {formData.incidentType}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date & Time:</span>
                        <p className="font-medium">
                          {formData.incidentDate} at {formData.incidentTime}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">
                          {formData.incidentLocation}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">
                          Complaint Against:
                        </span>
                        <p className="font-medium">
                          {formData.complaintAgainst}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium">{formData.narrative}</p>
                      </div>
                    </div>
                  </div>

                  {(formData.witness1Name || formData.witness2Name) && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Witnesses</h3>
                      <div className="space-y-2 text-sm">
                        {formData.witness1Name && (
                          <p>
                            <span className="text-gray-600">Witness 1:</span>{" "}
                            <span className="font-medium">
                              {formData.witness1Name} (
                              {formData.witness1Contact})
                            </span>
                          </p>
                        )}
                        {formData.witness2Name && (
                          <p>
                            <span className="text-gray-600">Witness 2:</span>{" "}
                            <span className="font-medium">
                              {formData.witness2Name} (
                              {formData.witness2Contact})
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      By submitting this blotter report, I confirm that the
                      information provided is true and accurate to the best of
                      my knowledge.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                >
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Submitting..." : "Submit Report"}
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
