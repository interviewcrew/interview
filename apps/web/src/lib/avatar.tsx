// import from the packages
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GetAvatarProps {
  seed: string;
  variant?: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({
  seed,
  variant = "botttsNeutral",
}: GetAvatarProps) => {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
    });
  }

  return avatar.toDataUri();
};
