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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import axios from "axios";
import { backendUrl } from "@/config";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

type Teacher = {
  id: string;
  userId: string;
  name: string;
};

const formSchema = z.object({
  teacherIds: z.array(z.string()),
  patentNumber: z.string().min(1, "Patent number is required"),
  patentTitle: z.string().min(1, "Patent title is required"),
  isCapstone: z.boolean().default(false),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  documentLink: z.string().url("Please enter a valid URL"),
});

export default function EditPatentForm() {
  const params = useParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherIds: [],
      patentNumber: "",
      patentTitle: "",
      isCapstone: false,
      year: "",
      documentLink: "",
    },
  });

  const { toast } = useToast();

  // Update the fetchPatent useEffect
  useEffect(() => {
    const fetchPatent = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/patent/${params.id}`,
          { withCredentials: true }
        );

        // Transform the response data to match form structure
        const patentData = {
          ...response.data.patent,
          teacherIds: response.data.patent.teachers.map(
            (t: Teacher) => t.userId
          ),
        };

        form.reset(patentData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patent:", error);
        toast({
          title: "Error",
          description: "Failed to fetch patent details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPatent();
    }
  }, [params.id]);

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user`, {
          withCredentials: true,
        });
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/patent/${params.id}`,
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Patent Updated",
          description: "Your patent has been successfully updated.",
          variant: "mine",
        });
        router.back();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating patent:", error);
      toast({
        title: "Update Error",
        description:
          "There was an error updating your patent. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Patent Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="teacherIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teachers</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={teachers.map((teacher) => ({
                          label: teacher.name,
                          value: teacher.id,
                        }))}
                        placeholder="Select teachers..."
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value} // Add controlled value
                        className="text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 gap-6">
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
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
