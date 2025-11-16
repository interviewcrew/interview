import { CodeIcon, FileTextIcon, MessageCircleIcon, UsersIcon } from "lucide-react";

const features = [
  {
    name: "AI-powered mock interviews",
    description:
      "Practice interviewing in a realistic environment, and get feedback on your performance.",
    icon: MessageCircleIcon,
    color: "bg-cyan-600/80 dark:bg-sky-600/60",
  },
  {
    name: "AI-powered resume builder",
    description:
      "Prepare your resume with AI, get feedback on it, and customize it to your dream job.",
    icon: FileTextIcon,
    color: "bg-fuchsia-600/80 dark:bg-fuchsia-600/60",
  },
  {
    name: "Everything is open source",
    description:
      "Feel free to look under the hood, and contribute to the project and make it better.",
    icon: CodeIcon,
    color: "bg-yellow-600/80 dark:bg-yellow-600/60",
  },
  {
    name: "Possibility to qualify for free exclusive coaching",
    description:
      "You have the chance to join our network, and get real human coaching, for free.",
    icon: UsersIcon,
    color: "bg-cyan-600/80 dark:bg-cyan-600/60",
  },
];

export default function CandidateFeatures() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 lg:mt-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-cyan-700 dark:text-cyan-500">
            Prepare for your dream job
          </h2>
          <p className="mt-2 text-4xl font-semibold text-pretty text-gray-900 sm:text-5xl lg:text-balance dark:text-white tracking-tight">
            Everything you need to ace your next job application
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            <span className="font-bold">InterviewCrew</span> is a set of tools
            that helps you prepare for your dream job.
            <br />
            And the best part is that{" "}
            <span className="font-bold">it&apos;s free and open source</span>.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div
                    className={`absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg ${feature.color}`}
                  >
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
