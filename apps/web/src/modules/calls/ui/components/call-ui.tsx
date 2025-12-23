// import from the framework
import { useState, useEffect } from "react";

// import from the packages
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";

// import from the libraries
import { InterviewGetById } from "@/modules/interviews/types";
import { track } from "@/lib/analytics";

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

  useEffect(() => {
    track("call_lobby_entered", { interview_id: interview.id });
  }, [interview.id]);

  const handleJoin = async () => {
    if (!call) return;

    await call.join();
    track("call_joined", { interview_id: interview.id });
    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    track("call_ended", { interview_id: interview.id });
    setShow("ended");
  };

  return <StreamTheme className="h-full">
    {show === "lobby" && <CallLobby onJoin={handleJoin} />}
    {show === "call" && <CallInProgress onLeave={handleLeave} interview={interview} />}
    {show === "ended" && <CallEnded />}
  </StreamTheme>;
};
