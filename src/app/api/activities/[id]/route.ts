import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

// zod is a library that helps us validate data at runtime
// it's useful for validating data coming from the client,
// since typescript only validates data at compile time.
// zod's schema syntax is pretty intuitive,
// read more about zod here: https://zod.dev/
// const postActivitiesRequestSchema = z.object({
//   handle: z.string().min(1).max(50),
//   content: z.string().min(1).max(280),
//   // name: z.string().min(1).max(280),
//   startTime: z.string().min(1).max(50),
//   endTime: z.string().min(1).max(50),
// });

// type PostActivitiesRequest = z.infer<typeof postActivitiesRequestSchema>;

type GetParamsType = {
  params: {
    id: number
  }
}

export async function GET(request: NextRequest, { params }: GetParamsType) {
  const eventId = params.id;
  try {
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
      .where(eq(activitiesTable.id, eventId))
      .execute();

    //console.log(activityData);
    return NextResponse.json({ activityData }, { status: 200 });
  } catch (error) {
    //console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
