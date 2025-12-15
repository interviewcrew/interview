import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function BlogFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
              <span className="font-semibold text-lg">Interview Crew</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              The open-source AI career coach for software engineers. Practice interviews, 
              build your resume, and land your dream job.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/interviewcrew/codebase"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="size-5" />
              </Link>
              <Link
                href="https://twitter.com/interviewcrew"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="size-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/interviewcrew"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="size-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Mock Interviews
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Interview Crew. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

