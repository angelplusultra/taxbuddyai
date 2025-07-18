"use client";
import React, { useState } from "react";
import {
  Calculator,
  FileText,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaxDocumentUpload from "@/components/tax-documents-upload";
import PersonalInfoForm from "@/components/personal-information-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { uploadTaxDocumentsAction } from "@/actions/uploadTaxDocuments";
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Tax1040Form from "@/components/Tax1040Form";

type PersonalInfoFormData = {
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  filingStatus:
    | "single"
    | "married-filing-jointly"
    | "married-filing-separately"
    | "head-of-household"
    | "qualifying-widow";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  occupation?: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseSSN?: string;
  spouseOccupation?: string;
  dependents: number;
  blindTaxpayer: boolean;
  blindSpouse: boolean;
  over65Taxpayer: boolean;
  over65Spouse: boolean;
};

export interface UploadedFile {
  id: string;
  file: File;
  type: "w2" | "1099-int" | "1099-nec" | "other";
  status: "uploading" | "completed" | "error";
  progress: number;
}
interface TenFourtyData {
    totalWages: number;
    totalNonemployeeCompensation: number;
    totalInterestIncome: number;
    totalFederalIncomeTaxWithheld: number;
    taxLiability: number;
    taxableIncome: number;
    grossIncome: number;
    refundOrAmountOwed: number;
    deduction: number;
}
const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(
    null
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { execute, isPending } = useServerAction(uploadTaxDocumentsAction);
  const [taxSummary, setTaxSummary] = useState<{
    totalIncome: number;
    totalTax: number;
    withholding: number;
    refund: number;
  } | null>(null);

  const [tenFourtyData, setTenFourtyData] = useState<TenFourtyData | null>(null);

  const handlePersonalInfoSubmit = (data: PersonalInfoFormData) => {
    setPersonalInfo(data);
    toast.success("Personal information saved successfully!");
    setCurrentStep(2);
  };

  const handleCalculateTaxes = async () => {
    const [data, error] = await execute({
      files: uploadedFiles.map((file) => file.file),
      personalInfo: {
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
        ssn: personalInfo?.ssn || "",
        dateOfBirth: personalInfo?.dateOfBirth || "",
        filingStatus: personalInfo?.filingStatus || "single",
        address: personalInfo?.address || "",
        city: personalInfo?.city || "",
        state: personalInfo?.state || "",
        zipCode: personalInfo?.zipCode || "",
        occupation: personalInfo?.occupation || "",
      },
    });
    if (error) {
      toast.error("Error calculating taxes");
      return;
    }
    toast.success(
      "Tax calculation completed! Form 1040 is ready for download."
    );
    setTaxSummary({
      totalIncome: data.grossIncome,
      totalTax: data.taxLiability,
      withholding: data.totalFederalIncomeTaxWithheld,
      refund: data.refundOrAmountOwed,
    });
    setTenFourtyData(data);
    setCurrentStep(3);
  };

  const steps = [
    {
      number: 1,
      title: "Personal Information",
      description: "Enter your personal details",
    },
    {
      number: 2,
      title: "Upload Documents",
      description: "Upload W-2, 1099 forms",
    },
    {
      number: 3,
      title: "Review & Calculate",
      description: "Review and calculate taxes",
    },
  ];
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                Tax Buddy AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Automated Tax Return Preparation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/20"
              >
                <Shield className="h-3 w-3 mr-1" />
                Secure & Private
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center w-full md:w-auto">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                      ${
                        currentStep >= step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                      ${
                        currentStep === step.number &&
                        "ring-2 ring-primary ring-offset-2"
                      }
                    `}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center w-full">
                    <p className="text-sm font-medium break-words">{step.title}</p>
                    <p className="text-xs text-muted-foreground break-words">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      hidden md:block w-16 h-px mx-4 mt-[-20px]
                      ${currentStep > step.number ? "bg-primary" : "bg-border"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Let&apos;s Get Started
                </h2>
                <p className="text-muted-foreground">
                  First, we&apos;ll need some basic information about you and
                  your tax situation.
                </p>
              </div>
              <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Upload Your Tax Documents
                </h2>
                <p className="text-muted-foreground">
                  Upload your W-2, 1099, and other tax documents. Our AI will
                  extract the necessary information.
                </p>
              </div>

              <TaxDocumentUpload
                setUploadedFiles={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back to Personal Info
                </Button>
                <Button
                  disabled={isPending || uploadedFiles.length === 0}
                  onClick={handleCalculateTaxes}
                  className="bg-gradient-to-r from-primary to-primary-light"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  Calculate Taxes
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && taxSummary && tenFourtyData && personalInfo && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Tax Calculation Complete!
                </h2>
                <p className="text-muted-foreground">
                  Your tax return has been calculated. Review the results below.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <Card className="border-success/20 bg-success/5">
                  <CardHeader>
                    <CardTitle className="text-success">Tax Summary</CardTitle>
                    <CardDescription>
                      Your 2024 tax calculation results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Income:</span>
                      <span className="font-medium">
                        {taxSummary.totalIncome.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tax:</span>
                      <span className="font-medium">
                        {taxSummary.totalTax.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Withholding:</span>
                      <span className="font-medium">
                        {taxSummary.withholding.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold text-success">
                        <span>
                          {taxSummary.refund > 0 ? "Refund:" : "Amount Owed:"}
                        </span>
                        <span>
                          {taxSummary.refund > 0
                            ? taxSummary.refund.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })
                            : (taxSummary.refund * -1).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>
                      Complete your tax filing process
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', aspectRatio: '8.5/11', height: 'auto', minHeight: '400px' }}>
                      <PDFViewer style={{ width: '100%', height: '100%', minHeight: '400px', border: 'none' }}>
                        <Tax1040Form taxpayer={personalInfo} taxData={tenFourtyData} />
                      </PDFViewer>
                    </div>
                    
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back to Documents
                </Button>
                <Button onClick={() => setCurrentStep(1)}>
                  Start New Return
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        {currentStep === 1 && (
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">
                Why Choose AI Tax Agent?
              </h3>
              <p className="text-muted-foreground">
                Automated, secure, and accurate tax preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Calculations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced AI algorithms ensure accurate tax calculations and
                    maximize your refund.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Bank-Level Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your sensitive tax information is protected with
                    enterprise-grade encryption.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Document Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automatically extract data from W-2s, 1099s, and other tax
                    documents.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
