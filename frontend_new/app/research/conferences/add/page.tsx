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

const formSchema = z.object({
  teacherIds: z.array(z.string()),
  bookTitle: z.string().min(1, "Book title is required"),
  paperTitle: z.string().min(1, "Paper title is required"),
  proceedings_conference_title: z
    .string()
    .min(1, "Proceedings/Conference title is required"),
  volumeNo: z.string().min(1, "Volume number is required"),
  issueNo: z.string().min(1, "Issue number is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  pageNumber: z.number().int().nonnegative(),
  issn: z.string().min(1, "ISSN is required"),
  is_affiliating_institution_same: z.boolean().default(false),
  publisherName: z.string().min(1, "Publisher name is required"),
  impactFactor: z.string().min(1, "Impact factor is required"),
  core: z.enum(["coreA", "coreB", "coreC", "scopus", "NA"]),
  link_of_paper: z.string().url("Please enter a valid URL"),
  isCapstone: z.boolean().default(false),
  abstract: z.string().min(1, "Abstract is required"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  domain: z.string().min(1, "Domain is required"),
});

export default function ConferenceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherIds: [],
      bookTitle: "",
      paperTitle: "",
      proceedings_conference_title: "",
      volumeNo: "",
      issueNo: "",
      year: "",
      pageNumber: 0,
      issn: "",
      is_affiliating_institution_same: false,
      publisherName: "",
      impactFactor: "",
      core: "NA",
      link_of_paper: "",
      isCapstone: false,
      abstract: "",
      keywords: [],
      domain: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/conference`,
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
          title: "Conference Publication Submitted",
          description:
            "Your conference publication has been successfully submitted.",
          variant: "mine",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting conference publication:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your conference publication. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-2">
      <Card className="w-full max-w-6xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Conference Publication Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bookTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Book Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paperTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Paper Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="proceedings_conference_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proceedings/Conference Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Proceedings/Conference Title"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <FormField
                  control={form.control}
                  name="is_affiliating_institution_same"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Affiliating Institution Same</FormLabel>
                        <FormDescription>
                          Check if the affiliating institution is the same
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="publisherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Publisher Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link_of_paper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link of Paper</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/paper"
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
                  name="core"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Core</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Core" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="coreA">Core A</SelectItem>
                          <SelectItem value="coreB">Core B</SelectItem>
                          <SelectItem value="coreC">Core C</SelectItem>
                          <SelectItem value="scopus">Scopus</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter keywords separated by commas"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.split(","))
                          }
                        />
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
