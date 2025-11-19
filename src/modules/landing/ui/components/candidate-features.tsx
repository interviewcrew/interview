import { FileTextIcon, MapIcon, MessageCircleIcon, UsersIcon } from "lucide-react";

const features = [
  {
    name: "AI-Powered Mock Interviews",
    description:
      "Simulate real technical interviews—from initial screening to system design. Get instant, detailed feedback on your code, communication, and problem-solving skills.",
    icon: MessageCircleIcon,
    color: "bg-cyan-600/80 dark:bg-sky-600/60",
  },
  {
    name: "Smart Resume & Cover Letter Builder",
    description:
      "Stop sending generic applications. Our AI analyzes job descriptions and helps you tailor your resume and cover letter to highlight exactly what hiring managers are looking for.",
    icon: FileTextIcon,
    color: "bg-fuchsia-600/80 dark:bg-fuchsia-600/60",
  },
  {
    name: "Career Pathway & Roadmap",
    description:
      "Don't practice randomly. Get a personalized preparation roadmap and curated resources to bridge your skill gaps and navigate the tech job market effectively.",
    icon: MapIcon,
    color: "bg-yellow-600/80 dark:bg-yellow-600/60",
  },
  {
    name: "The 'A-Player' Fast Track",
    description:
      "Prove your skills and qualify for our exclusive talent catalog. Top performers get free, expert human coaching and direct introductions to premium employers.",
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
            The Complete Career Toolkit
          </h2>
          <p className="mt-2 text-4xl font-semibold text-pretty text-gray-900 sm:text-5xl lg:text-balance dark:text-white tracking-tight">
            Everything you need to land your dream role
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            <span className="font-bold">InterviewCrew</span> gives you the premium tools usually reserved for paid coaching programs.
            <br />
            Practice, improve, and get discovered. All for <span className="font-bold">free</span>.
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
