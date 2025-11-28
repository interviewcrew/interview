import {
  ShieldCheckIcon,
  UserCheckIcon,
  TrendingUpIcon,
  SearchIcon,
  ScaleIcon,
} from 'lucide-react'

const features = [
  {
    name: 'Top 1% Talent Only.',
    description: 'We are not a job board. We are an exclusive club. We reject 99% of applicants so you only see the absolute best engineers in the market.',
    icon: UserCheckIcon,
  },
  {
    name: 'Rigorous Technical Vetting.',
    description: 'Every candidate undergoes a grueling, human-led technical assessment. If they can\'t build it live, they don\'t get into our catalog.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'No Mediocre Matches.',
    description: 'We don\'t flood your inbox. You get 3-5 perfectly matched profiles. Quality over quantity is our only metric.',
    icon: TrendingUpIcon,
  },
  {
    name: 'EU AI Act Compliant.',
    description: 'Innovation without the risk. Our "Human-in-the-Loop" process ensures your hiring pipeline is safe, ethical, and fully compliant.',
    icon: ScaleIcon,
  },
  {
    name: 'Zero Risk Model.',
    description: 'We are so confident in our quality that you don\'t pay a cent until the candidate passes probation. If they don\'t work out, you owe us nothing.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Hidden Gems Discovered.',
    description: 'Our AI uncovers elite engineers from non-traditional paths who outperform standard hires but are missed by traditional recruiters.',
    icon: SearchIcon,
  },
]

export default function CompaniesFeatures() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-base/7 font-semibold text-cyan-700 dark:text-cyan-500">Exclusive Talent Network</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Only A-Players. <br /> No Compromises.
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            Most agencies send you a pile of resumes. We send you your next key hire. Access a strictly vetted, high-performance engineering workforce that is ready to deliver from day one.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16 dark:text-gray-400">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <feature.icon
                  aria-hidden="true"
                  className="absolute top-1 left-1 size-5 text-cyan-600 dark:text-cyan-500"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
