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
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  nameOfStudent: z.string().min(1, "Name of student is required"),
  nameOfEvent: z.string().min(1, "Name of event is required"),
  link: z.string().min(1, "Link to relevant documents is required"),
  nameOfUniv: z
    .string()
    .min(1, "Name of University where the event was held is required"),
  yearOfEvent: z.string().min(1, "Year of the event is required"),
  teamOrIndi: z.enum(["Team", "Individual"], {
    required_error: "Please select a option.",
  }),
  level: z.enum(["Inter-University", "State", "National", "International"], {
    required_error: "Please select a option",
  }),
  nameOfAward: z.enum(["Runner-Up", "Winners"], {
    required_error: "Please select a option",
  }),
});

export default function EditInterSportsForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOfStudent: "",
      nameOfEvent: "",
      nameOfUniv: "",
      link: "",
      yearOfEvent: "",
      teamOrIndi: undefined,
      level: undefined,
      nameOfAward: undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/interSports/${params.id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const eventData = response.data.data;
          form.reset(eventData);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch event data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [params.id, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/interSports/${params.id}`,
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
          "There was an error updating your event. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sports and Cultural Events/Competitions Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nameOfStudent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Student</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the Student"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Event</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the event"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfUniv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name of the University/Academy that organized the event
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the University/Academy that organized the event"
                        {...field}
                      />
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
              <FormField
                control={form.control}
                name="teamOrIndi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team/Individual</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Team">Team</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfAward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Runner-Up/Winners</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Runner-Up">Runner-Up</SelectItem>
                        <SelectItem value="Winners">Winners</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Inter-University/State/National/International
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inter-University">
                          Inter-University
                        </SelectItem>
                        <SelectItem value="State">State</SelectItem>
                        <SelectItem value="National">National</SelectItem>
                        <SelectItem value="International">
                          International
                        </SelectItem>
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
