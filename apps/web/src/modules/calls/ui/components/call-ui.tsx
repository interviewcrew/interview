// import from the framework
import { useState } from "react";

// import from the packages
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";

// import from the libraries
import { InterviewGetById } from "@/modules/interviews/types";

// import from the components
import { CallLobby } from "@/modules/calls/ui/components/call-lobby";
import { CallInProgress } from "@/modules/calls/ui/components/call-in-progress";
import { CallEnded } from "@/modules/calls/ui/components/call-ended";

interface CallUIProps {
  interview: InterviewGetById;
}

export const CallUI = ({ interview }: CallUIProps) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;

    await call.join();

    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow("ended");
  };

  return <StreamTheme className="h-full">
    {show === "lobby" && <CallLobby onJoin={handleJoin} />}
    {show === "call" && <CallInProgress onLeave={handleLeave} interview={interview} />}
    {show === "ended" && <CallEnded />}
  </StreamTheme>;
};
