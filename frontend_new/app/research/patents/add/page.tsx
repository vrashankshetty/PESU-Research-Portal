"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

const formSchema = z.object({
  teacherIds: z.array(z.string()),
  campus: z.enum(["EC", "RR", "HSN"], {
    required_error: "Please select a campus.",
  }),
  dept: z.enum(["EC", "CSE"], {
    required_error: "Please select a department.",
  }),
  patentNumber: z.string().min(1, "Patent number is required"),
  patentTitle: z.string().min(1, "Patent title is required"),
  isCapstone: z.boolean().default(false),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  documentLink: z.string().url("Please enter a valid URL"),
});

export default function PatentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherIds: [],
      campus: undefined,
      dept: undefined,
      patentNumber: "",
      patentTitle: "",
      isCapstone: false,
      year: "",
      documentLink: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://10.2.80.90:8081/api/v1/patent",
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
          title: "Patent Submitted",
          description: "Your patent has been successfully submitted.",
          variant: "mine",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting patent:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your patent. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Patent Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="patentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patent Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Patent Number" {...field} />
                      </FormControl>
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
                            <SelectValue placeholder="Select a campus" />
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
                  name="dept"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EC">EC</SelectItem>
                          <SelectItem value="CSE">CSE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="patentTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patent Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Patent Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isCapstone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Capstone</FormLabel>
                        <FormDescription>
                          Check if capstone project
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="documentLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/document"
                        {...field}
                      />
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
