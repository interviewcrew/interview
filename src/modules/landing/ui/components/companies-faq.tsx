const companiesFaqs = [
  {
    id: 1,
    question: "How rigorous is your vetting?",
    answer:
      "Ruthless yet practical. We skip the LeetCode puzzles and test for real-world engineering capability: system architecture, debugging complex race conditions, and clean code practices. We verify they can build, not just memorize. Less than 1% make the cut.",
  },
  {
    id: 2,
    question: 'What does "EU AI Act Compliant" mean for us?',
    answer:
      "Total peace of mind. As hiring regulations tighten, we future-proof your pipeline. Our 'Human-in-the-Loop' model means every AI-sourced decision is validated by a human expert, keeping you compliant and lawsuit-free.",
  },
  {
    id: 3,
    question: 'What is your "Zero Risk" guarantee?',
    answer:
      "You pay nothing upfront. You pay nothing to interview. You only pay if you hire, and even then, we protect you: if the candidate doesn't pass probation, we refund 100% of the fee. We take all the risk so you don't have to.",
  },
  {
    id: 4,
    question: 'How quickly can we hire?',
    answer: "Immediately. These aren't passive candidates. They are pre-vetted, active, and ready to interview today. Most of our partners go from 'Intro' to 'Signed Offer' in under 14 days.",
  },
  {
    id: 5,
    question: "What roles do you cover?",
    answer:
      "From high-potential Interns to battle-tested Staff Engineers. We don't just match skills; we match stages. Whether you need a scrappy startup generalist or a specialized scale-up architect, we find the 'A-Player' for your specific context.",
  },
  {
    id: 6,
    question: 'Why not just use a standard agency?',
    answer:
      "Agencies send you resumes; we send you engineers. We are built by engineers who know the difference between 'knowing React' and 'understanding browser internals'. We don't waste your senior team's time with false positives.",
  },
  {
    id: 7,
    question: "How do you find talent that others miss?",
    answer:
      "The market is noisy. Great engineers are getting rejected by keyword bots before you even see them. Our free practice platform attracts thousands of these hidden gems. We judge them on code, not keywords, surfacing elite talent that traditional channels are blind to.",
  },
  {
    id: 8,
    question: "Why can't we just screen resumes ourselves?",
    answer:
      "Because resumes lie. Exceptional engineers often look identical to average ones on paper. You simply don't have the resources to interview everyone. We do. We technically audit the entire pool first, ensuring you only spend time meeting the proven winners.",
  },
]

export default function CompaniesFAQ() {
  return (
    <div className="relative bg-white dark:bg-gray-900 isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-0"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:opacity-20"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
            Have a different question? Reach out to our founder directly at{' '}
            <a
              href="mailto:sadjad@interviewcrew.io"
              className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              sadjad@interviewcrew.io
            </a>{' '}
            and we’ll get back to you immediately.
          </p>
        </div>
        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-x-6 sm:gap-y-16 lg:gap-x-10">
            {companiesFaqs.map((faq) => (
              <div key={faq.id}>
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
