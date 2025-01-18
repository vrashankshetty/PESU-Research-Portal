"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookie from "js-cookie";
import Link from "next/link";
import { backendUrl } from "@/config";
const formSchema = z.object({
  empId: z.string().min(6, { message: "EMP ID must be at least 6 characters" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empId: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/login`,
        values,
        {
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.data.message === "Successfully logged in") {
        console.log("Setting cookies", response.data.token);
        Cookie.set("accessToken", response.data.token, {
          expires: 1,
          domain: "10.2.80.90",
        });
        Cookie.set("accessToken", response.data.token, {
          expires: 1,
          domain: "localhost",
        });
        router.push(`/`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.response.data || "An error occurred during login",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full bg-white bg-opacity-95 text-sky-800">
        <CardHeader>
          <CardTitle className="md:text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your PES credentials to access your account
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="empId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMP ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="block">
              <Button type="submit" className="w-full bg-sky-800">
                Login
              </Button>
              <p className="mt-2 text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                  Register now!
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
