import { NextResponse, type NextRequest } from "next/server";

import { and, eq} from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { availableTimeTable } from "@/db/schema";

const postAvailableRequestSchema = z.object({
  userHandle: z.string().min(1).max(50),
  activityId: z.number(),
  availableTime: z.number(),
  isInserting: z.boolean(),
});

export async function POST(request: NextRequest) {
  // //console.log("oest request:s", request);
  const receiveData = await request.json();
  //console.log("receiveData:", receiveData);

  try {
    postAvailableRequestSchema.parse(receiveData);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  //console.log("Success")

  const data = {
    ...receiveData,
    time: receiveData.availableTime,
  };

  const { userHandle, activityId, time, isInserting } = data;

  try {
    if (isInserting) {
      const result = await db
        .insert(availableTimeTable)
        .values({
          userHandle: userHandle,
          activityId,
          time,
        })
        .returning({ activityId: availableTimeTable.id })
        .execute();

      //console.log("add success!");
      return NextResponse.json(result[0], { status: 200 });
    } else {
      await db
        .delete(availableTimeTable)
        .where(
          and(
            eq(availableTimeTable.activityId, activityId),
            eq(availableTimeTable.userHandle, userHandle),
            eq(availableTimeTable.time, time),
          ),
        )
        .execute();

      //console.log("delete success!");
      return NextResponse.json(
        { message: "Deleted successfully" },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

type GetParamsType = {
  params: {
    id: number;
  };
};

export async function GET(request: NextRequest, { params }: GetParamsType) {
  const eventId = params.id;
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  try {
    let query = db
      .select({
        userHandle: availableTimeTable.userHandle,
        activityId: availableTimeTable.activityId,
        availableTime: availableTimeTable.time,
      })
      .from(availableTimeTable);

    if (username) {
      query = query.where(
        and(
          eq(availableTimeTable.activityId, eventId),
          eq(availableTimeTable.userHandle, username),
        ),
      );
    } else {
      query = query.where(eq(availableTimeTable.activityId, eventId));
    }

    const availableTimes = await query.execute();

    const counter = new Array(192).fill(0);

    availableTimes.forEach((availableTime) => {
      counter[availableTime.availableTime] += 1;
    });

    // //console.log("availableTimes:", availableTimes);
    return NextResponse.json({ counter }, { status: 200 });
  } catch (error) {
    //console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: GetParamsType) {
  const activityId = params.id;
  const data = await request.json();
  const userHandle = data.userHandle;

  //console.log("userHandle:", userHandle, "ActivityId", activityId);
  try {
    await db
      .delete(availableTimeTable)
      .where(
        and(
          eq(availableTimeTable.activityId, activityId),
          eq(availableTimeTable.userHandle, userHandle),
        ),
      )
      .execute();
    //console.log("d2:", d2)
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    //console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
