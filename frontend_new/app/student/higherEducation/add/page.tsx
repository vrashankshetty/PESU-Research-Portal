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
import { backendUrl } from "@/config";

const formSchema = z.object({
  studentName: z.string().min(1, "Name of the student is required"),
  programGraduatedFrom: z.enum(["BTech", "Mech", "BCom", "MCom", "BBA", "BPharma", "Nursing"], {
    required_error: "Please select a program of graduation",
  }),
  institutionAdmittedTo: z.string().min(1, "Institution of admittance is required"),
  programmeAdmittedTo: z.string().min(1, "Program of Admittance is required"),
  year: z.string().min(1, "Graduation year of the student is required"),
});

// const formSchema = z.object({
//   studentName: z.string().min(1, "Name of the student is required"),
//   link: z.string().min(1, "Link to relevant documents is required"),
//   programGraduatedFrom: z.enum(["BTech", "Mech", "BCom", "MCom", "BBA", "BPharma", "Nursing"], {
//     required_error: "Please select a program of graduation",
//   }),
//   institutionAdmittedTo: z.string().min(1, "Institution of admittance is required"),
//   programmeAdmittedTo: z.string().min(1, "Program of Admittance is required"),
//   year: z.string().min(1, "Graduation year of the student is required"),
// });

export default function HigherEducationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      programGraduatedFrom: undefined,
      institutionAdmittedTo: "",
      programmeAdmittedTo: "",
      year: ""
    },
  });

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     studentName: "",
  //     link: "",
  //     program: undefined,
  //     institution: "",
  //     programGraduated: "",
  //   },
  // });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/studentHigherStudies`,
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
      console.error("Error submitting student entry:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your student entry. Please try again.",
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
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the student</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the student" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
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
              /> */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation year of the student (Postgraduate Degree)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the year of the activity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="programmeAdmittedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program of Admittance</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the program of admittance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="institutionAdmittedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution of Admittance</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the institution of admittance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>




              <FormField
                control={form.control}
                name="programGraduatedFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program of Graduation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Program of Graduation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BTech">BTech</SelectItem>
                        <SelectItem value="Mech">Mech</SelectItem>
                        <SelectItem value="BCom">BCom</SelectItem>
                        <SelectItem value="MCom">MCom</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                        <SelectItem value="BPharma">BPharma</SelectItem>
                        <SelectItem value="Nursing">Nursing</SelectItem>
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
