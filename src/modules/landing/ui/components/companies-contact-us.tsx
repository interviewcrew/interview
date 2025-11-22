"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitContactForm } from "@/modules/landing/server/actions";
import { useTransition } from "react";
import { z } from "zod";
import { contactFormSchema } from "@/modules/landing/schemas";

export default function CompaniesContactUs() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await submitContactForm(data);
        if (result.success) {
          toast.success("Thanks for reaching out! We'll be in touch shortly.");
          reset();
        } else {
          toast.error(result.error || "Something went wrong");
        }
      } catch {
        toast.error("Failed to submit form. Please try again.");
      }
    });
  };

  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-64}
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg
          x="50%"
          y={-64}
          className="overflow-visible fill-gray-50 dark:fill-gray-800/40"
        >
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
      <div className="mx-auto max-w-xl lg:max-w-4xl">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
          Start hiring A-Players
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
          Tell us who you&apos;re looking for. We&apos;ll send you a curated
          list of pre-vetted engineers within 48 hours.
        </p>
        <div className="mt-16 flex flex-col-reverse gap-16 sm:gap-y-20 lg:flex-row">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:flex-auto">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 backdrop-blur-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-cyan-500 ${
                      errors.firstName ? "outline-red-500" : ""
                    }`}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 backdrop-blur-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-cyan-500 ${
                      errors.lastName ? "outline-red-500" : ""
                    }`}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  Work Email
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 backdrop-blur-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-cyan-500 ${
                      errors.email ? "outline-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="role"
                    className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
                  >
                    Role you are hiring for
                  </label>
                  <span className="text-sm/6 text-gray-500 dark:text-gray-400">
                    Optional
                  </span>
                </div>
                <div className="mt-2.5">
                  <input
                    id="role"
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 backdrop-blur-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-cyan-500 ${
                      errors.role ? "outline-red-500" : ""
                    }`}
                    {...register("role")}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="message"
                    className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
                  >
                    Additional Details
                  </label>
                  <span className="text-sm/6 text-gray-500 dark:text-gray-400">
                    Optional
                  </span>
                </div>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="e.g. We are a Series A startup looking for a Node.js expert to lead our platform team. Need to hire within 30 days."
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 backdrop-blur-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-cyan-500 ${
                      errors.message ? "outline-red-500" : ""
                    }`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                disabled={isPending}
                className="block w-full rounded-md bg-cyan-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus-visible:outline-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Submitting..." : "Get Vetted Candidates"}
              </button>
            </div>
            <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
              Zero risk. You only pay if you hire.
            </p>
          </form>
          <div className="lg:mt-6 lg:w-80 lg:flex-none">
            <Image
              alt="Zeeg Logo"
              src="/client-logos/zeeg.svg"
              className="h-12 w-auto dark:invert"
              width={100}
              height={48}
            />
            <figure className="mt-10">
              <blockquote className="text-lg/8 font-semibold text-gray-900 dark:text-white">
                <p>
                  “As a busy founder, filtering hundreds of resumes was drowning
                  us. InterviewCrew took over the entire pipeline. They
                  didn&apos;t just send resumes; they sent us 3 fully-vetted
                  engineers who were ready for culture fit interviews. We hired
                  our lead within weeks. It saved us massive amounts of time.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex gap-x-6">
                <div>
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    Mo
                  </div>
                  <div className="text-sm/6 text-gray-600 dark:text-gray-400">
                    CEO of Zeeg
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
