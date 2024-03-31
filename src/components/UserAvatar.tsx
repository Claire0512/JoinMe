"use client";

import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  className?: string;
};

export default function UserAvatar({ className }: UserAvatarProps) {
  const { avatarURL } = useUserInfo();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarURL}
      alt="user avatar"
      // width={80}
      // height={80}
      // style={{ padding: '10px' }}
      className={cn(className, "rounded-full")}
    />
  );
}
