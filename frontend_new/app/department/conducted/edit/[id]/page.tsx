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
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { backendUrl } from "@/config";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

const formSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  nameOfProgram: z.string().min(1, "Program name is required"),
  noOfParticipants: z.string().regex(/^\d+$/, "Please enter a valid number"),
  durationStartDate: z.string().min(1, "Start date is required"),
  durationEndDate: z.string().min(1, "End date is required"),
  documentLink: z.string().url("Please enter a valid URL"),
});

export default function EditConductedForm() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      nameOfProgram: "",
      noOfParticipants: "",
      durationStartDate: "",
      durationEndDate: "",
      documentLink: "",
    },
  });

  const { toast } = useToast();

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/departmentConductedActivity/${params.id}`,
          { withCredentials: true }
        );

        const data = response.data;

        form.reset({
          year: data.year,
          nameOfProgram: data.nameOfProgram,
          noOfParticipants: data.noOfParticipants.toString(),
          durationStartDate: data.durationStartDate,
          durationEndDate: data.durationEndDate,
          documentLink: data.documentLink,
        });

        setDateRange({
          from: new Date(data.durationStartDate),
          to: new Date(data.durationEndDate),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, form, toast]);

  useEffect(() => {
    if (dateRange?.from) {
      form.setValue("durationStartDate", format(dateRange.from, "dd-MM-yyyy"));
    }
    if (dateRange?.to) {
      form.setValue("durationEndDate", format(dateRange.to, "dd-MM-yyyy"));
    }
  }, [dateRange, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/departmentConductedActivity/${params.id}`,
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
          title: "Updated Successfully",
          description: "The conducted program has been updated successfully.",
          variant: "mine",
        });
        router.push("/department");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating conducted program:", error);
      toast({
        title: "Update Error",
        description:
          "There was an error updating the program. Please try again.",
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
            Edit Conducted Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormField
                  control={form.control}
                  name="noOfParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Participants</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter number of participants"
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
                name="nameOfProgram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Program</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter program name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <FormLabel>Duration</FormLabel>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={(range) => {
                      setDateRange(range);
                    }}
                  />
                  <FormMessage>
                    {form.formState.errors.durationStartDate?.message}
                  </FormMessage>
                  <FormMessage>
                    {form.formState.errors.durationEndDate?.message}
                  </FormMessage>
                </div>
              </div>
              <FormField
                control={form.control}
                name="documentLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Document</FormLabel>
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
