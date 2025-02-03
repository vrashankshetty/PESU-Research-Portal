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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { backendUrl } from "@/config";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teacherIds: z.array(z.string()),
  journalName: z.string().min(1, "Journal name is required"),
  month: z.string().min(1, "Month is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  volumeNo: z.string().min(1, "Volume number is required"),
  issueNo: z.string().min(1, "Issue number is required"),
  issn: z.string().min(1, "ISSN is required"),
  websiteLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  articleLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  isUGC: z.boolean().default(false),
  isScopus: z.boolean().default(false),
  isWOS: z.boolean().default(false),
  qNo: z.enum(["Q1", "Q2", "Q3", "Q4", "NA"]),
  impactFactor: z.string().optional(),
  isCapstone: z.boolean().default(false),
  isAffiliating: z.boolean().default(false),
  pageNumber: z.number().int().nonnegative().optional(),
  abstract: z.string().min(1, "Abstract is required"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  domain: z.string().min(1, "Domain is required"),
});

type Teacher = {
  id: string;
  name: string;
  userId: string;
};

export default function EditJournalForm() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      teacherIds: [],
      journalName: "",
      month: "",
      year: "",
      volumeNo: "",
      issueNo: "",
      issn: "",
      websiteLink: "",
      articleLink: "",
      isUGC: false,
      isScopus: false,
      isWOS: false,
      qNo: "NA",
      impactFactor: "",
      isCapstone: false,
      isAffiliating: false,
      pageNumber: 0,
      abstract: "",
      keywords: [],
      domain: "",
    },
  });

  const { toast } = useToast();

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

  // Fetch existing journal data
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/journal/${params.id}`,
          { withCredentials: true }
        );

        // Transform journal data to include teacherIds
        const journalData = {
          ...response.data.journal,
          teacherIds: response.data.journal.teachers.map(
            (t: Teacher) => t.userId
          ),
          // Keep keywords as array
          keywords: response.data.journal.keywords,
        };

        form.reset(journalData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching journal:", error);
        toast({
          title: "Error",
          description: "Failed to fetch journal details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJournal();
    }
  }, [params.id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/journal/${params.id}`,
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
          title: "Journal Publication Updated",
          description:
            "Your journal publication has been successfully updated.",
          variant: "mine",
        });
        router.back();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating journal publication:", error);
      toast({
        title: "Update Error",
        description:
          "There was an error updating your journal publication. Please try again.",
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
            Edit Journal Publication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="journalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Journal Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Co-Author(s)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={teachers.map((teacher) => ({
                          label: teacher.name,
                          value: teacher.id,
                        }))}
                        placeholder="Select teachers..."
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          <SelectItem value="March">March</SelectItem>
                          <SelectItem value="April">April</SelectItem>
                          <SelectItem value="May">May</SelectItem>
                          <SelectItem value="June">June</SelectItem>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                          <SelectItem value="October">October</SelectItem>
                          <SelectItem value="November">November</SelectItem>
                          <SelectItem value="December">December</SelectItem>
                        </SelectContent>
                      </Select>
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
                <FormField
                  control={form.control}
                  name="pageNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Page Number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="volumeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Volume Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issueNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Issue Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISSN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ISSN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="websiteLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="articleLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/article"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="isUGC"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is UGC</FormLabel>
                        <FormDescription>Check if UGC approved</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isScopus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Scopus</FormLabel>
                        <FormDescription>
                          Check if Scopus indexed
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isWOS"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is WOS</FormLabel>
                        <FormDescription>
                          Check if Web of Science indexed
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="qNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q Number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Q Number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Q1">Q1</SelectItem>
                          <SelectItem value="Q2">Q2</SelectItem>
                          <SelectItem value="Q3">Q3</SelectItem>
                          <SelectItem value="Q4">Q4</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="impactFactor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Factor</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Impact Factor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Domain" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                  name="isAffiliating"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Affiliating</FormLabel>
                        <FormDescription>
                          Check if affiliating institution
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Abstract" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter keywords separated by commas"
                        value={field.value.join(",")} // Join array to string for display
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map(k => k.trim()).filter(k => k)
                          )
                        }
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
