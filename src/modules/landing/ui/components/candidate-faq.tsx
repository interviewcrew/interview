"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is InterviewCrew?",
    answer:
      "InterviewCrew is a set of tools that helps you prepare for your dream job. It includes an AI-powered mock interviews, an AI-powered resume builder, and a network of real human coaches to help you get your dream job.",
  },
  {
    question: "How does the AI-powered mock interviews work?",
    answer:
      "The mock interviews are powered by top frontier models. Based on the step of the interview (i.e. Initial screening, Live coding, System design), the AI will conduct a mock interview and give you feedback on your performance.",
  },
  {
    question: "How does the AI-powered resume builder work?",
    answer:
      "By uploading your resume, the AI will analyze your resume and give you feedback on it. We have many templates to choose from, and you can customize it to your dream job.",
  },
  {
    question: "What's the network of A-player candidates and how does it work?",
    answer:
      "A-player means different things to different companies. We try to identify the best candidates that are prepared, and coach them with our real human coaches, for free, and help them find their dream job.",
  },
  {
    question: "Why is it Interview Crew free for candidates?",
    answer:
      "We try to find the best candidates for companies to hire. When you find your dream job through us, we will get paid by the company and everyone will be happy :)",
  },
  {
    question: "Why is it open source?",
    answer:
      "We are building tools for software engineers to prepare for their next opportunity, so it's natural that they want to look under the hood and fix the parts that are bothering them, and we love to get help from the community building it",
  },
];

export default function CandidateFAQ() {
  return (
    <div className="bg-white dark:bg-gray-900 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-16">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-white hover:no-underline items-center min-h-24">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
