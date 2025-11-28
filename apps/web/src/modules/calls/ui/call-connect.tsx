"use client";

// import from the framework
import { useEffect, useState } from "react";

// import from the packages
import { LoaderIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

// import from the libraries
import { useTRPC } from "@/trpc/client";
import { InterviewGetById } from "@/modules/interviews/types";

// import from the components
import { CallUI } from "@/modules/calls/ui/components/call-ui";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface CallConnectProps {
  interview: InterviewGetById;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  interview,
  userId,
  userName,
  userImage,
}: CallConnectProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.interviews.generateToken.mutationOptions()
  );

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY as string,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateToken]);

  const [call, setCall] = useState<Call>();
  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", interview.id);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, interview.id]);

  if (!call || !client) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI interview={interview} />
      </StreamCall>
    </StreamVideo>
  );
};
