import Image from "next/image";

export default function Clients() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg/8 font-semibold text-gray-900 dark:text-white">
          Trusted by some of the world&apos;s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none">
          <Image
            alt="Emma Sleep"
            src="/client-logos/emma-sleep.svg"
            width={158}
            height={55}
            className="col-span-2 max-h-10 w-full object-contain lg:col-span-1 dark:hidden"
          />
          <Image
            alt="Emma Sleep"
            src="/client-logos/emma-sleep.svg"
            width={158}
            height={55}
            className="col-span-2 max-h-10 w-full object-contain not-dark:hidden lg:col-span-1"
          />

          <Image
            alt="Faircado"
            src="/client-logos/faircado.svg"
            width={158}
            height={95}
            className="col-span-2 max-h-8 w-full object-contain lg:col-span-1 dark:hidden"
          />
          <Image
            alt="Faircado"
            src="/client-logos/faircado.svg"
            width={158}
            height={95}
            className="col-span-2 max-h-8 w-full object-contain not-dark:hidden lg:col-span-1"
          />

          <Image
            alt="EnopAI"
            src="/client-logos/enopai.svg"
            width={158}
            height={28}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:hidden"
          />
          <Image
            alt="EnopAI"
            src="/client-logos/enopai.svg"
            width={158}
            height={28}
            className="col-span-2 max-h-12 w-full object-contain not-dark:hidden lg:col-span-1"
          />

          <Image
            alt="Zeeg"
            src="/client-logos/zeeg.svg"
            width={158}
            height={65}
            className="col-span-2 max-h-11 w-full object-contain sm:col-start-2 lg:col-span-1 dark:hidden"
          />
          <Image
            alt="Zeeg"
            src="/client-logos/zeeg.svg"
            width={158}
            height={65}
            className="col-span-2 max-h-11 w-full object-contain not-dark:hidden sm:col-start-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
