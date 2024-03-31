"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import useAttendance from "@/hooks/useAttendance";
import { cn } from "@/lib/utils";

type AttendanceButtonProps = {
  // initialAttendance: number;
  initialAttended?: boolean;
  activityId: number;
  handle?: string;
};

export default function AttendanceButton({
  initialAttended,
  activityId,
  handle,
}: AttendanceButtonProps) {
  const [attended, setAttended] = useState(initialAttended);
  // const [_, setAttendanceCount] = useState(initialAttendance);
  const { attendanceActivity, unAttendanceActivity, loading } = useAttendance();
  // let tmp = 1;
  // if(_){
  //   tmp = 2;
  // }
  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the activity page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (attended) {
      await unAttendanceActivity({
        activityId,
        userHandle: handle,
      });
      // setAttendanceCount((prev) => prev - 1);
      setAttended(false);
    } else {
      await attendanceActivity({
        activityId,
        userHandle: handle,
      });
      // setAttendanceCount((prev) => prev + 1);
      setAttended(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-auto items-center gap-1 rounded border px-3 py-2 transition-colors hover:text-brand",
        attended ? "bg-brand text-white" : "bg-white text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <span>{attended ? "我已參加" : "我想參加"}</span>
      {/* {attendanceCount > 0 && <span className="ml-2">{attendanceCount}</span>} */}
    </button>
  );
}
