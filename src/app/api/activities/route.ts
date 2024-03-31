import { NextResponse, type NextRequest } from "next/server";


import { z } from "zod";

import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

const postActivitiesRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  content: z.string().min(1).max(280),
  // name: z.string().min(1).max(280),
  startTime: z.string().min(1).max(50),
  endTime: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  //console.log(request);
  const receiveData = await request.json();
  try {
    postActivitiesRequestSchema.parse(receiveData);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = {
    ...receiveData,
    startTime: new Date(receiveData.startTime + ":00:00"),
    endTime: new Date(receiveData.endTime + ":00:00"),
  };

  const { handle, content, startTime, endTime } = data;

  try {
    const result = await db
      .insert(activitiesTable)
      .values({
        userHandle: handle,
        content,
        startTime,
        endTime,
      })
      .returning({ activityId: activitiesTable.id })
      .execute();
    //console.log("add success!");
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
