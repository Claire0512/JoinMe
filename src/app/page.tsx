
import List from "@mui/material/List";
import { eq, desc, sql } from "drizzle-orm";

import Activity from "@/components/Activity";
import Header from "@/components/Header";
import NameDialog from "@/components/NameDialog";
import { db } from "@/db";
import {
  attendanceTable,
  usersTable,
  activitiesTable,
} from "@/db/schema";

type HomePageProps = {
  searchParams: {
    username?: string;
    handle?: string;
    searchTerm?: string;
  };
  // searchTerm?: string;
};

export default async function Home({
  searchParams: { username, handle, searchTerm },
}: HomePageProps) {
  if (username && handle) {
    await db
      .insert(usersTable)
      .values({
        displayName: username,
        handle,
      })

      .onConflictDoUpdate({
        target: usersTable.handle,
        set: {
          displayName: username,
        },
      })
      .execute();
  }

  const attendanceSubquery = db.$with("attendance_count").as(
    db
      .select({
        activityId: attendanceTable.activityId,
        attendance: sql<number | null>`count(*)`
          .mapWith(Number)
          .as("attendance"),
      })
      .from(attendanceTable)
      .groupBy(attendanceTable.activityId),
  );

  const attendedSubquery = db.$with("attended").as(
    db
      .select({
        activityId: attendanceTable.activityId,

        attended: sql<number>`1`.mapWith(Boolean).as("attended"),
      })
      .from(attendanceTable)
      .where(eq(attendanceTable.userHandle, handle ?? "")),
  );

  // const [searchTerm, setSearchTerm] = useState('');
//  console.log(searchTerm);
  const activities = await db
    .with(attendanceSubquery, attendedSubquery)

    .select({
      id: activitiesTable.id,
      content: activitiesTable.content,
      handle: usersTable.handle,
      startTime: activitiesTable.startTime,
      username: usersTable.displayName,
      endTime: activitiesTable.endTime,
      createdAt: activitiesTable.createdAt,
      attendance: attendanceSubquery.attendance,
      attended: attendedSubquery.attended,
    })
    .from(activitiesTable)
    // .where(isNull(activitiesTable.replyToActivityId))
    .orderBy(desc(activitiesTable.createdAt))

    .innerJoin(usersTable, eq(activitiesTable.userHandle, usersTable.handle))
    .leftJoin(
      attendanceSubquery,
      eq(activitiesTable.id, attendanceSubquery.activityId),
    )
    .leftJoin(
      attendedSubquery,
      eq(activitiesTable.id, attendedSubquery.activityId),
    )
    .where(
      searchTerm
        ? sql`LOWER(${activitiesTable.content}) LIKE LOWER('%'||${searchTerm}||'%')`
        : sql`1=1`,
    )

    .execute();

  return (
    <>
      {/* <div > */}
      {/* <h1 className="mb-2 bg-white px-4 text-xl font-bold">Home</h1> */}
      {/* <div> */}
      <Header />
      {/* </div> */}
      {/* <Separator /> */}
      <div style={{ padding: "10px" }}>
        <List
          component="nav"
          aria-label="secondary mailbox folder"
          style={{ padding: "40px" }}
        >
          {/* {activities.map((activity) => (
          <Activity
            key={activity.id}
            id={activity.id}
            username={username}
            handle={handle}
            // authorName={activity.username}
            // authorHandle={activity.handle}
            content={activity.content}
            attendance={activity.attendance}
            attended={activity.attended}
            createdAt={activity.createdAt!}
            startTime={activitiesTable.startTime}
            endTime={activitiesTable.endTime}
          />
        ))} */}
          {activities
            .sort(
              (a, b) =>
                new Date(a.createdAt!).getTime() -
                new Date(b.createdAt!).getTime(),
            )
            .map((activity) => (
              <Activity
                key={activity.id}
                id={activity.id}
                username={username}
                handle={handle}
                content={activity.content}
                attendance={activity.attendance}
                attended={activity.attended}
              />
            ))}
        </List>
      </div>
      {/* </div> */}
      <NameDialog />
    </>
  );
}
