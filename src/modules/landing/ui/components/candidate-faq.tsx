"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is InterviewCrew really free for candidates?",
    answer:
      "Yes. Our business model is based on placing top talent with companies. We provide these premium AI preparation tools for free to help you become the best candidate you can be. When you succeed, we succeed.",
  },
  {
    question: "How does the 'A-Player' Fast Track work?",
    answer:
      "Candidates who consistently demonstrate excellence in our AI mock interviews and assessments are invited to our 'A-Player' program. This involves a rigorous human-led vetting process. If you pass, you gain access to exclusive coaching and direct placement opportunities with our partner companies.",
  },
  {
    question: "What AI tools are included?",
    answer:
      "You get full access to our AI Mock Interviewer (covering screening, technical, and system design rounds), our Smart Resume & Cover Letter Builder, and personalized Career Pathway guides.",
  },
  {
    question: "Is this just another job board?",
    answer:
      "No. We are an AI-first recruitment agency. We don't just list jobs; we help you prepare for them. For our 'A-Player' candidates, we actively advocate for you with employers, bypassing the standard application 'black hole'.",
  },
  {
    question: "Why is the project open source?",
    answer:
      "We believe in transparency and community. As a platform built for engineers, by engineers, we want you to trust the tools you're using. You can inspect our code, contribute features, and help us build the best recruitment platform in the world.",
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
