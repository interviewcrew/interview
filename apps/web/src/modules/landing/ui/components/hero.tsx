"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { LandingPageAudience } from "@/modules/landing/ui/components/select-landing-page-audience";
import SelectLandingPageAudience from "@/modules/landing/ui/components/select-landing-page-audience";
import ThemeToggle from "@/components/ui/theme-toggle";

interface HeroProps {
  landingPageAudience: LandingPageAudience;
  setLandingPageAudience: (landingPageAudience: LandingPageAudience) => void;
  setIsTerminalVisible: (isVisible: boolean) => void;
}

export default function Hero({
  landingPageAudience,
  setLandingPageAudience,
  setIsTerminalVisible,
}: HeroProps) {
  return (
    <div className="bg-transparent min-h-[20vh]">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 md:py-2 lg:px-8"
        >
          <div className="flex flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Interview Crew</span>
              {/* Mobile logos */}
              <Image
                alt="InterviewCrew Logo"
                src="/logo-light.svg"
                className="h-8 w-auto dark:hidden md:hidden"
                width={32}
                height={32}
              />
              <Image
                alt="InterviewCrew Logo"
                src="/logo-dark.svg"
                className="h-8 w-auto hidden dark:block dark:md:hidden"
                width={32}
                height={32}
              />
              {/* Desktop logos */}
              <Image
                alt="InterviewCrew Logo"
                src="/logo-typography-light.svg"
                className="h-16 w-auto hidden md:block dark:md:hidden"
                width={158}
                height={64}
              />
              <Image
                alt="InterviewCrew Logo"
                src="/logo-typography-dark.svg"
                className="h-16 w-auto hidden dark:md:block"
                width={158}
                height={64}
              />
            </a>
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="flex flex-1 justify-end items-center">
            <Link
              href="https://github.com/interviewcrew/codebase"
              target="_blank"
              className="font-semibold text-gray-900 dark:text-white mr-4 "
            >
              <Button variant="outline" size="sm" className="p-0 m-0">
                <FaGithub className="size-4" />
                <span className="hidden lg:block">star us on github</span>
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

      <div className="relative isolate">
        {/* Background shades*/}
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
        {/* Content */}
        <div className="">
          <div className="mx-auto max-w-7xl">
            <SelectLandingPageAudience
              landingPageAudience={landingPageAudience}
              setLandingPageAudience={setLandingPageAudience}
              className="mt-24"
            />
            <div className="mx-auto max-w-xl md:max-w-4xl xl:max-w-7xl text-center p-6 mt-6 md:p-24 md:mt-16 md:bg-gray-200/30 md:dark:bg-white/10 md:rounded-lg md:bg-clip-padding md:backdrop-filter md:backdrop-blur-sm md:border md:shadow-lg md:dark:shadow-gray-100/10">
              <h1 className="text-4xl tracking-tight text-gray-900 sm:text-5xl lg:text-balance dark:text-white">
                <span className="block text-base font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-4">
                  Interview Crew
                </span>
                {landingPageAudience === LandingPageAudience.CANDIDATES ? (
                  <>
                    <strong className="block mb-2 font-semibold text-pretty">
                      Master the Technical Interview.
                    </strong>{" "}
                    <div className="text-4xl leading-10">
                      Free AI tools to prepare, practice, and get hired.
                    </div>
                  </>
                ) : (
                  <>
                    <strong className="block mb-2 font-semibold text-pretty">
                      Hire the Top 1% of Engineers.
                    </strong>{" "}
                    <div className="text-4xl leading-10">
                      Risk-free access to pre-vetted A-Players.
                    </div>
                  </>
                )}
              </h1>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {landingPageAudience === LandingPageAudience.CANDIDATES ? (
                  <>
                    <Link href="/sign-up">
                      <Button
                        size="lg"
                        className="text-base bg-cyan-800 dark:bg-cyan-700 dark:text-white hover:bg-cyan-600 dark:hover:bg-cyan-500"
                      >
                        Get started
                      </Button>
                    </Link>
                    <button
                      onClick={() => setIsTerminalVisible(true)}
                      className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer items-center gap-1 hidden md:flex"
                    >
                      <span className="font-mono text-green-600 dark:text-green-500 mr-1">
                        &gt;
                      </span>
                      sudo open_terminal
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="https://zeeg.me/interviewcrew/introduction-call"
                      target="_blank"
                    >
                      <Button size="lg" className="text-base bg-cyan-800 dark:text-white dark:bg-cyan-700 hover:bg-cyan-600 dark:hover:bg-cyan-500">
                        Hire A-Players
                      </Button>
                    </Link>
                    <Link
                      href="/blog"
                      className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
              </div>
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
