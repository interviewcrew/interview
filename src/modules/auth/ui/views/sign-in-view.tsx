"use client";

// Imports from the framework
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Imports from the packages
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, OctagonAlertIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
// import { FaGithub, FaGoogle } from "react-icons/fa";

// Imports from the components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
      }
    );
  };

  const onSocialSubmit = (provider: "github" | "google") => {
    setPending(true);
    setError(null);

    authClient.signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
        onSuccess: () => {
          setPending(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="relative grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Sign In</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your email and password to sign in to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
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
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button className="w-full" type="submit" disabled={pending}>
                  {pending ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    or continue with
                  </span>
                </div> */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={pending}
                    onClick={() => onSocialSubmit("google")}
                  >
                    <FaGoogle /> 
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={pending}
                    onClick={() => onSocialSubmit("github")}
                  >
                    <FaGithub /> 
                  </Button>
                </div> */}
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center min-h-[600px] overflow-hidden">
            <Image
              src="/background-gradient.jpg"
              alt="background"
              className="absolute inset-0 h-full w-full object-cover"
              fill
              priority
            />
            <div className="relative z-10 flex flex-col gap-y-4 items-center">
              <Image src="/logo-dark.svg" alt="logo" width={92} height={92} />
              <p className="text-2xl font-semibold text-sky-200">
                InterviewCrew
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking sign in, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};
