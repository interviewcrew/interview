// import from the framework
import Link from "next/link";
import Image from "next/image";

// import from the packages
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

// import from the libraries
import { InterviewGetById } from "@/modules/interviews/types";

interface CallInProgressProps {
  onLeave: () => void;
  interview: InterviewGetById;
}

export const CallInProgress = ({ onLeave, interview }: CallInProgressProps) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit"
        >
          <Image
            src="/logo-typography-dark.svg"
            alt="logo"
            width={158}
            height={64}
          />
        </Link>
        <h4 className="text-base">{interview.title}</h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
