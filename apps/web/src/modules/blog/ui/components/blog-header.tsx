"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav
        aria-label="Main navigation"
        className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
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
              className="h-8 w-auto hidden dark:block"
              width={32}
              height={32}
            />
            <span className="hidden sm:inline-block font-semibold text-lg">
              Interview Crew
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="https://github.com/interviewcrew/codebase"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <FaGithub className="size-4 mr-2" />
              Star on GitHub
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden">
              <FaGithub className="size-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="sm" className="bg-cyan-700 hover:bg-cyan-800 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

