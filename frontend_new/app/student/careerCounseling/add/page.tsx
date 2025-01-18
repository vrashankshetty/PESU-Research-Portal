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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { backendUrl } from "@/config";

const formSchema = z.object({
  link: z.string().min(1, "Link to relevant documents is required"),
  noOfStudents: z.string().min(1, "The no. of students that attended/participated is required"),
  yearOfEvent: z.string().min(1, "Year of the counseling is required"),
  nameOfTheActivity: z.string().min(1, "Name of the activity is required"),
});

export default function CareerCounselingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      noOfStudents: "",
      yearOfEvent: "",
      nameOfTheActivity: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/studentCareerCounselling`,
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
          title: "Record Submitted",
          description:
            "Your record has been successfully submitted.",
          variant: "mine",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting record publication:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your record publication. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Graduated Students who have progressed to Higher Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="yearOfEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of the activity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the year of the activity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfTheActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Activity conducted by the HEI to offer guidance for competitive examinations & career counseling offered by the institution</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name of the activity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="noOfStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of students attended / participated</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the number of students attended / participated" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
