import { useState } from "react";

import { useRouter } from "next/navigation";

import useAttendance from "@/hooks/useAttendance";
import useUserInfo from "@/hooks/useUserInfo";

export default function useActivity() {
  const [loading, setLoading] = useState(false);
  const { username} = useUserInfo();
  const router = useRouter();
  const { attendanceActivity } = useAttendance();
  const postActivity = async ({
    handle,
    content,
    startTime,
    endTime,
  }: {
    handle: string;
    content: string;
    startTime: string;
    endTime: string;
  }) => {
    setLoading(true);
   // console.log("hi");
    const res = await fetch("/api/activities", {
      method: "POST",
      body: JSON.stringify({
        handle,
        content,
        startTime,
        endTime,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    const body = await res.json();
    const activityId = body.activityId;
  
    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.

    router.refresh();
    router.push(
      `/activity/${activityId}?username=${username}&handle=${handle}`,
    );
    await attendanceActivity({
      activityId,
      userHandle: handle,
    });
    setLoading(false);
  };

  return {
    postActivity,
    loading,
  };
}
