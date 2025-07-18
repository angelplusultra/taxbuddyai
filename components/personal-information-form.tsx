"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User, Users, Home } from "lucide-react";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  filingStatus: z.enum([
    "single",
    "married-filing-jointly",
    "married-filing-separately",
    "head-of-household",
    "qualifying-widow",
  ]),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  occupation: z.string().optional(),
  spouseFirstName: z.string().optional(),
  spouseLastName: z.string().optional(),
  spouseSSN: z.string().optional(),
  spouseOccupation: z.string().optional(),
  dependents: z.number().min(0).max(20),
  blindTaxpayer: z.boolean(),
  blindSpouse: z.boolean(),
  over65Taxpayer: z.boolean(),
  over65Spouse: z.boolean(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoFormData) => void;
  initialData?: Partial<PersonalInfoFormData>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ssn: "",
      dateOfBirth: "",
      filingStatus: "single" as const,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      occupation: "",
      spouseFirstName: "",
      spouseLastName: "",
      spouseSSN: "",
      spouseOccupation: "",
      dependents: 0,
      blindTaxpayer: false,
      blindSpouse: false,
      over65Taxpayer: false,
      over65Spouse: false,
      ...initialData,
    },
  });

  const filingStatus = form.watch("filingStatus");
  const isMarried =
    filingStatus === "married-filing-jointly" ||
    filingStatus === "married-filing-separately";

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter your personal details for your tax return. All fields marked
          with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Taxpayer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Taxpayer Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Security Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="XXX-XX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filing Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select filing status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover">
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married-filing-jointly">
                            Married Filing Jointly
                          </SelectItem>
                          <SelectItem value="married-filing-separately">
                            Married Filing Separately
                          </SelectItem>
                          <SelectItem value="head-of-household">
                            Head of Household
                          </SelectItem>
                          <SelectItem value="qualifying-widow">
                            Qualifying Widow(er)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Spouse Information */}
            {isMarried && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Spouse Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spouseFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter spouse first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spouseLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter spouse last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spouseSSN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse SSN</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX-XX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spouseOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Occupation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter spouse occupation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Home className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Address Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover max-h-60">
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium">Additional Information</h3>
              </div>

              <FormField
                control={form.control}
                name="dependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="over65Taxpayer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Taxpayer is 65 or older</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="blindTaxpayer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Taxpayer is blind</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {isMarried && (
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="over65Spouse"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Spouse is 65 or older</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="blindSpouse"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Spouse is blind</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Save Information
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
