// import from the framework
import Link from "next/link";

// import from the packages
import { LogInIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

// import from the libraries
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";

// import from the components
import { Button } from "@/components/ui/button";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface CallLobbyProps {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user?.name ?? "",
          image:
            data?.user?.image ??
            generateAvatarUri({
              seed: data?.user?.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermissions = () => {
  return (
    <p className="text-sm">
      Please grant your browser permission to access your camera and microphone.
    </p>
  );
};

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasMicrophonePermission } =
    useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission =
    hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg shadow-sm p-10">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join the call?</h6>
            <p className="text-sm">Set up your call before joining.</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 justify-between w-full">
            <Button asChild variant="ghost">
              <Link href="/dashboard/interviews">Cancel</Link>
            </Button>
            <Button onClick={onJoin} disabled={!hasBrowserMediaPermission}>
              <LogInIcon /> Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
