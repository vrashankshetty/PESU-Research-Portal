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
import { useEffect, useState } from "react";
import Link from "next/link";

const formSchema = z.object({
  event: z.string().min(1, "Event is required"),
  link: z.string().min(1, "Link to relevant documents is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  yearOfEvent: z.string().min(1, "Year of the event is required"),
});

export default function EditIntraSportsForm() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: "",
      startDate: "",
      endDate: "",
      yearOfEvent: "",
      link: "",
    },
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/intraSports/${params.id}`,
          { withCredentials: true }
        );

        const data = response.data.data;
        // Format dates to YYYY-MM-DD for input type="date"
        const formatDate = (dateString: string) => {
          return new Date(dateString).toISOString().split("T")[0];
        };

        form.reset({
          event: data.event,
          link: data.link,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          yearOfEvent: data.yearOfEvent,
        });
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [params.id, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/intraSports/${params.id}`,
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
          title: "Event Updated",
          description: "Your event has been successfully updated.",
          variant: "mine",
        });
        router.back();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Update Error",
        description:
          "There was an error updating your record. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Sports and Cultural Event/Competition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the event/competition</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the event/competition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link to relevant documents (Upload in this{" "}
                      <Link
                        href="https://drive.google.com/drive/folders/1eWpdRB1Iw63beACZcfEmTf4QjdQJItm4?usp=drive_link"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Event Start date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Event End date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="yearOfEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the year of the event</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex. 2023" {...field} />
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
