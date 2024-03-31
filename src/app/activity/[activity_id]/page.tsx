import * as React from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { eq, desc, and } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import AttendanceButton from "@/components/AttendanceButton";
import Comment from "@/components/Comment";
import ReplyInput from "@/components/ReplyInput";
import Timetable from "@/components/Timetable";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import {
  attendanceTable,
  activitiesTable,
  usersTable,
  commentsTable,
} from "@/db/schema";

type ActivityPageProps = {
  params: {
    // this came from the file name: [activity_id].tsx
    activity_id: string;
  };
  searchParams: {
    // this came from the query string: ?username=madmaxieee
    username?: string;
    handle?: string;
  };
};

// these two fields are always available in the props object of a page component
export default async function ActivityPage({
  params: { activity_id },
  searchParams: { username, handle },
}: ActivityPageProps) {
  // this function redirects to the home page when there is an error
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    handle && params.set("handle", handle);
    redirect(`/?${params.toString()}`);
  };
  // const { username, handle } = useUserInfo();
  //console.log("username:", username, "handle:", handle);
  // if the activity_id can not be turned into a number, redirect to the home page
  const activity_id_num = parseInt(activity_id);
  //console.log("activity_id:", activity_id, "activity_id_num:", activity_id_num);
  if (isNaN(activity_id_num)) {
    //console.log("isNaN(activity_id_num)");
    errorRedirect();
  }

  const [activityData] = await db
    .select({
      id: activitiesTable.id,
      content: activitiesTable.content,
      startTime: activitiesTable.startTime,
      endTime: activitiesTable.endTime,
      userHandle: activitiesTable.userHandle,
      createdAt: activitiesTable.createdAt,
    })
    .from(activitiesTable)
    .where(eq(activitiesTable.id, activity_id_num))
    .execute();

  if (!activityData) {
    //console.log("!activityData");
    errorRedirect();
  }
  //console.log("activityData: ", activityData);
  const attendance = await db
    .select({
      id: attendanceTable.id,
    })
    .from(attendanceTable)
    .where(eq(attendanceTable.activityId, activity_id_num))
    .execute();
  //console.log("attendance: ", attendance);
  const numAttendance = attendance.length;

  const [attended] = await db
    .select({
      id: attendanceTable.id,
    })
    .from(attendanceTable)
    .where(
      and(
        eq(attendanceTable.activityId, activity_id_num),
        eq(attendanceTable.userHandle, handle ?? ""),
      ),
    )
    .execute();
  //console.log("Line 95");
  const [user] = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .where(eq(usersTable.handle, activityData.userHandle))
    .execute();

  const activity = {
    id: activityData.id,
    content: activityData.content,
    startTime: activityData.startTime,
    endTime: activityData.endTime,
    username: user.displayName,
    handle: user.handle,
    attendance: numAttendance,
    createdAt: activityData.createdAt,
    attended: Boolean(attended),
  };

 

  const replies = await db
    // .with(attendanceSubquery, attendedSubquery)
    .select({
      id: commentsTable.id,
      content: commentsTable.content,

      userHandle: commentsTable.userHandle,

      createdAt: commentsTable.createdAt,
    })
    .from(commentsTable)
    .where(eq(commentsTable.replyToActivityId, activity_id_num))
    .orderBy(desc(commentsTable.createdAt))
    .innerJoin(usersTable, eq(commentsTable.userHandle, usersTable.handle))

    .execute();

  //console.log("Line 157");
  // return <div>Hello World</div>;
  function formatDate(date: Date) {
    // const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours(),
    ).padStart(2, "0")}`;
  }

  return (
    <>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ height: "60px" }}>
            <Toolbar
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ position: "absolute", left: "15px" }}>
                <Link href={{ pathname: "/", query: { username, handle } }}>
                  <ArrowLeft size={18} />
                </Link>
              </div>
              <h1 className="text-xl font-bold">{activity.content}</h1>
            </Toolbar>
          </AppBar>
        </Box>

        <div style={{ padding: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="font-bold" style={{ whiteSpace: "nowrap" }}>
              From : {formatDate(activity.startTime) ?? "..."} To :{" "}
              {formatDate(activity.endTime) ?? "..."}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "gray",
                  whiteSpace: "nowrap",
                }}
              >
                {activity.attendance + 0} 人參加
              </p>
              <AttendanceButton
                handle={handle}
                // initialAttendance={activity.attendance}
                initialAttended={activity.attended}
                activityId={activity.id}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div style={{ display: "flex" }}>
        {/* Comment section on the left */}
        <div style={{ flex: 1, maxWidth: "50%" }}>
          <ReplyInput
            replyToActivityId={activity.id}
            replyToHandle={activity.handle}
            attended={activity.attended}
          />
          <Separator />
          <Stack spacing={4} padding={5}>
            {replies
              .sort(
                (a, b) =>
                  new Date(a.createdAt!).getTime() -
                  new Date(b.createdAt!).getTime(),
              )
              .map((reply) => (
                <Comment
                  key={reply.id}
                  id={reply.id}
                  userHandle={reply.userHandle}
                  content={reply.content}
                  createdAt={reply.createdAt!}
                  replyToActivityId={activity.id}
                  userName={reply.userHandle}
                />
              ))}
          </Stack>
        </div>

        {/* Timetable on the right */}
        <div style={{ flex: 1 }}>
          <Timetable
            isParticipating={activity.attended}
            userHandle={handle || ""}
            activityId={activity.id}
            participationCount={activity.attendance}
          />
        </div>
      </div>
    </>
  );
}
