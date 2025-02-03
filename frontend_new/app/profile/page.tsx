"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { backendUrl } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

const departmentExpertiseMap = {
  CSE: [
    "ML/AI",
    "DATA SCIENCE",
    "IOT",
    "NETWORKS",
    "MICROPROCESSORS",
    "MICROCONTROLLERS",
    "DEEP LEARNING",
    "COMPUTER VISION",
    "CYBERSECURITY",
    "CLOUD COMPUTING",
    "WEB DEVELOPMENT",
    "BIG DATA AND DATA ANALYTICS",
    "DATA MINING",
  ],
  ECE: [
    "DIGITAL VLSI",
    "ANALOG VLSI",
    "SIGNAL PROCESSING",
    "EMBEDDED SYSTEMS",
    "COMMUNICATION ENGINEERING",
  ],
  "Science & Humanities": [
    "ADVANCED MATERIALS",
    "FLUID DYNAMICS",
    "GEOMETRIC FUNCTION THEORY",
    "GRAPH THEORY",
    "OPERATIONS RESEARCH",
    "QUANTUM AND NANO DEVICES/ QUANTUM COMPUTING",
    "MATERIALS AND MANUFACTURING",
  ],
  "Commerce & Management": [
    "ACCOUNTS",
    "HUMAN RESOURCE",
    "MARKETING",
    "FINANCE",
    "ECONOMICS",
  ],
  "Pharmaceutical Sciences": [
    "PHARMACEUTICAL CHEMISTRY",
    "PHARMACEUTICS",
    "PHARMACOLOGY",
    "PHARMACOGNOSY",
    "PHARMACEUTICAL ANALYSIS",
    "PHARMACY PRACTICE",
  ],
} as const;

const formSchema = z.object({
  empId: z.string().min(6, { message: "EMP ID must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phno: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  dept: z.enum([
    "CSE",
    "ECE",
    "Science & Humanities",
    "Commerce & Management",
    "Pharmaceutical Sciences",
  ]),
  campus: z.enum(["EC", "RR", "HN"]),
  panNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, { message: "Invalid PAN number format" }),
  qualification: z.string().min(2, { message: "Qualification is required" }),
  designation: z.string().min(2, { message: "Designation is required" }),
  expertise: z.string().min(2, { message: "Expertise is required" }),
  dateofJoining: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  totalExpBfrJoin: z
    .string()
    .min(1, { message: "Total experience is required" }),
  googleScholarId: z.string(),
  sId: z.string().min(1, { message: "SID is required" }),
  oId: z.string().min(1, { message: "OID is required" }),
});

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user/profile`, {
          withCredentials: true,
        });

        Object.keys(response.data).forEach((key) => {
          form.setValue(key as any, response.data[key]);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/user/profile`,
        values,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "mine",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "Failed to update profile",
      });
    }
  }


  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      })
      return
    }

    try {
      await axios.post(
        `${backendUrl}/api/v1/user/changeProfilePassword`,
        { newPassword, confirmPassword },
        { withCredentials: true },
      )
      toast({
        title: "Success",
        variant: "mine",
        description: "Password changed successfully",
      })
      setIsChangePasswordOpen(false)
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password",
      })
    }
  }


  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center p-2">
      <Card className="w-full max-w-6xl bg-white bg-opacity-95 text-sky-800">
        <CardHeader className="text-center">
          <CardTitle className="md:text-2xl">Profile</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="empId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EMP ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your employee ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dept"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("expertise", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(departmentExpertiseMap).map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your campus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EC">EC</SelectItem>
                          <SelectItem value="RR">RR</SelectItem>
                          <SelectItem value="HSN">HSN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your PAN number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your qualification"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your designation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your area of expertise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentExpertiseMap[form.getValues("dept")] &&
                            departmentExpertiseMap[form.getValues("dept")].map(
                              (expertise) => (
                                <SelectItem key={expertise} value={expertise}>
                                  {expertise}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateofJoining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalExpBfrJoin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Experience Before Joining</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your total experience"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="googleScholarId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Scholar ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Google Scholar ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your SID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your OID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <div className="flex justify-between pb-2 mx-5">
              <Button type="submit" className="bg-sky-800">
                Save Changes
              </Button>
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-sky-700 text-white hover:bg-sky-600">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>Enter your new password below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-password" className="text-right">
                    New Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirm-password" className="text-right">
                    Confirm Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleChangePassword} className="bg-sky-700 text-white hover:bg-sky-600">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
