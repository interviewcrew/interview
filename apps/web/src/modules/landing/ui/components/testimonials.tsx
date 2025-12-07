import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col pb-10 sm:pb-16 lg:pr-8 lg:pb-0 xl:pr-20">
            <Image
              alt="Etoro Logo Light"
              src="/testimonials/companies/etoro.svg"
              className="h-12 self-start dark:invert"
              width={128}
              height={64}
            />
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg/8 text-gray-900 dark:text-gray-100">
                <p>
                  “Personally, I had an exceptional experience with the
                  interview services provided by InterviewCrew. The process was
                  incredibly efficient and professional, making the entire
                  process seamless and stress-free. <br />
                  Though the tests provided by InterviewCrew weren&apos;t that
                  easy to pass it was convenient and interesting ones. Honestly,
                  Compared to other interviews I&apos;ve had, InterviewCrew
                  stood out for its organization and clarity. <br />I highly
                  recommend InterviewCrew to anyone seeking a positive and
                  professional interview experience.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <Image
                  alt="Oren Hoffman"
                  src="/testimonials/avatars/oren.png"
                  width={64}
                  height={64}
                  className="rounded-full bg-gray-50 object-none dark:bg-gray-800"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Oren Hoffman
                  </div>
                  <div className="mt-1 text-gray-500 dark:text-gray-400">
                    Software Engineer at eToro
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-20 dark:border-white/10">
            <Image
              alt="Faircado Logo Light"
              src="/testimonials/companies/faircado.svg"
              className="h-12 self-start dark:invert"
              width={158}
              height={64}
            />
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg/8 text-gray-900 dark:text-gray-100">
                <p>
                  “InterviewCrew allowed me to fully showcase my skills. The
                  interview rounds were both challenging and engaging, creating
                  a collaborative team effort. I particularly appreciated that
                  their interviews closely mirrored real-world work scenarios,
                  which I found very beneficial.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <Image
                  alt="Usman Sajjad"
                  src="/testimonials/avatars/usman.png"
                  width={64}
                  height={64}
                  className="rounded-full bg-gray-50 object-none dark:bg-gray-800"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Usman Sajjad
                  </div>
                  <div className="mt-1 text-gray-500 dark:text-gray-400">
                    Software Engineer at Faircado
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
