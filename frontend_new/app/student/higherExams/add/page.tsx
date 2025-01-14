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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

const formSchema = z.object({
  yearOfEvent: z.string().min(1, "Year of the examination is required"),
  registrationNo: z.string().min(1, "Registration no./ Roll no. of the examination is required"),
  nameOfStudent: z.string().min(1, "Name of qualified student is required"),
  link: z.string().min(1, "Link to relevant documents is required"),
  exam: z.enum(["NET","SLET","GATE","GMAT","CAT","GRE","JAM","IELTS","TOEFL","Civil Services","State government examinations"], {
    required_error: "Please select a qualifying exam",
  }),
});

export default function InterSportsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearOfEvent: "",
      registrationNo: "",
      nameOfStudent: "",
      link: "",
      exam: undefined,
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:5500/api/v1/journal",
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
            Students qualifying in State/ National/ International level examinations
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
                name="registrationNo"
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
                name="nameOfStudent"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
              <FormField
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
                          <SelectItem value="Team">NET/SLET/GATE/GMAT/CAT/GRE/JAM/IELTS/TOEFL/Civil Services/State government examinations</SelectItem>
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
