"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { backendUrl } from "@/config";

const formSchema = z.object({
  year: z.string().min(1, "Year of the examination is required"),
  registrationNumber: z.string().min(1, "Registration no./ Roll no. of the examination is required"),
  studentName: z.string().min(1, "Name of qualified student is required"),
  isNET: z.boolean().default(false),
  isSLET: z.boolean().default(false),
  isGATE: z.boolean().default(false),
  isGMAT: z.boolean().default(false),
  isCAT: z.boolean().default(false),
  isGRE: z.boolean().default(false),
  isJAM: z.boolean().default(false),
  isIELTS: z.boolean().default(false),
  isTOEFL: z.boolean().default(false),
});

export default function InterSportsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      registrationNumber: "",
      studentName: "",
      isNET: false,
      isSLET: false,
      isGATE: false,
      isGMAT: false,
      isCAT: false,
      isGRE: false,
      isJAM: false,
      isIELTS: false,
      isTOEFL: false,
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/studentEntranceExam`,
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast({
          title: "Event Submitted",
          description:
            "Your record has been successfully submitted.",
          variant: "mine",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting record:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your record. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Students qualifying in State/ National/ International level examinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of the exam</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the year of the exam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration no./ Roll no. of the examination</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the Registration no./ Roll no. of the examination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Student</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name of the Student" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to relevant documents</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the link to relevant documents" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div> */}
              {/* <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifying Exam</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the appropriate qualifying exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NET">NET</SelectItem>
                        <SelectItem value="SLET">SLET</SelectItem>
                        <SelectItem value="GATE">GATE</SelectItem>
                        <SelectItem value="GMAT">GMAT</SelectItem>
                        <SelectItem value="CAT">CAT</SelectItem>
                        <SelectItem value="GRE">GRE</SelectItem>
                        <SelectItem value="JAM">JAM</SelectItem>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                        <SelectItem value="TOEFL">TOEFL</SelectItem>
                        <SelectItem value="Civil Services">Civil Services</SelectItem>
                        <SelectItem value="State government examinations">State government examinations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}


              <div>Select the Qualifying Exam</div>
              <FormField
                control={form.control}
                name="isNET"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>NET</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSLET"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>SLET</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isGATE"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>GATE</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isGMAT"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>GMAT</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isCAT"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>CAT</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isGRE"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>GRE</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isJAM"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>JAM</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isIELTS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>IELTS</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTOEFL"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>TOEFL</FormLabel>
                    </div>
                  </FormItem>
                )}
              />



              <div className="flex justify-center">
                <Button type="submit" className="bg-sky-800">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
