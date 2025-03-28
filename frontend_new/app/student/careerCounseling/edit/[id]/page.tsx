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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const formSchema = z.object({
  documentLink: z.string().min(1, "Link to relevant documents is required"),
  numberOfStudents: z
    .string()
    .min(1, "The no. of students that attended/participated is required"),
  year: z.string().min(1, "Year of the counseling is required"),
  activityName: z.string().min(1, "Name of the activity is required"),
});

export default function EditCareerCounselingForm() {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      activityName: "",
      numberOfStudents: "",
      documentLink: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/studentCareerCounselling/${params.id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const data = response.data;
          form.reset({
            year: data.year,
            activityName: data.activityName,
            numberOfStudents: data.numberOfStudents,
            documentLink: data.documentLink,
          });
        }
      } catch (error) {
        console.error("Error fetching record:", error);
        toast({
          title: "Error",
          description: "Failed to fetch record details",
          variant: "destructive",
        });
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/studentCareerCounselling/${params.id}`,
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
          title: "Record Updated",
          description: "Your record has been successfully updated.",
          variant: "mine",
        });
        router.back();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Update Error",
        description:
          "There was an error updating your record. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Career Counseling Record
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
                    <FormLabel>Year of the activity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the year of the activity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name of the Activity conducted by the HEI to offer
                      guidance for competitive examinations & career counseling
                      offered by the institution
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the activity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numberOfStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Number of students attended / participated
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the number of students attended / participated"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Link to relevant documents (Upload in this{" "}
                        <Link
                          href="https://drive.google.com/drive/folders/1XcuJLytDoSUxUVeAehTDKy0-elN438cr?usp=drive_link"
                          className="text-blue-500 hover:underline"
                          target="_blank"
                        >
                          Drive
                        </Link>
                        )
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the link to relevant documents"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
