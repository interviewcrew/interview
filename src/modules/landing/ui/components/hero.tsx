"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="bg-transparent min-h-[20vh]">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Interview Crew</span>
              <Image
                alt="InterviewCrew Logo"
                src="/logo-light.svg"
                className="h-8 w-auto dark:hidden"
                width={32}
                height={32}
              />
              <Image
                alt="InterviewCrew Logo"
                src="/logo-dark.svg"
                className="h-8 w-auto not-dark:hidden"
                width={32}
                height={32}
              />
            </a>
          </div>
          <div className="flex flex-1 justify-end items-center">
            <Link
              href="https://github.com/interviewcrew/interview"
              target="_blank"
              className="font-semibold text-gray-900 dark:text-white mr-4 "
            >
              <Button variant="outline" size="sm" className="p-0 m-0">
                <FaGithub className="size-4"/>
                <span className="hidden lg:block">Checkout the code</span>
              </Button>
            </Link>
            <Link
              href="/sign-in"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate pt-24">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:opacity-20"
          />
        </div>
        <div className="mt-25">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl tracking-tight text-gray-900 sm:text-5xl lg:text-balance dark:text-white">
                <strong className="block mb-2 font-semibold text-pretty">
                  Interview Crew
                </strong>{" "}
                <div className="text-4xl leading-10">
                  Preparing A-Players for their dream job.
                </div>
              </h1>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75 dark:opacity-20"
          />
        </div>
      </div>
    </div>
  );
}
