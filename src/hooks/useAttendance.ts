import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useAttendance() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const attendanceActivity = async ({
    activityId,
    userHandle,
  }: {
    activityId: number;
    userHandle: string;
  }) => {
    if (loading) return;
    setLoading(true);
    console.log("activityId: ", activityId, "userHandle: ", userHandle);
    const res = await fetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify({
        activityId,
        userHandle,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const unAttendanceActivity = async ({
    activityId,
    userHandle,
  }: {
    activityId: number;
    userHandle: string;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/attendance", {
      method: "DELETE",
      body: JSON.stringify({
        activityId,
        userHandle,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    console.log("activityId = ", activityId, "userHandle =", userHandle);

    const resAvailable = await fetch(`/api/availableTime/${activityId}`, {
      method: "DELETE",
      body: JSON.stringify({
        userHandle,
      }),
    });

    console.log(resAvailable);

    if (!resAvailable.ok) {
      const body = await resAvailable.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    attendanceActivity,
    unAttendanceActivity,
    loading,
  };
}
