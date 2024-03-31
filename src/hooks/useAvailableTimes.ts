import { useState, useEffect } from "react";

import {valid } from "@/lib/utils";

type EventTimeType = {
  startTime: Date;
  endTime: Date;
};

export default function useAvailableTimes(
  eventId: number,
  username: string,
  isParticipating: boolean,
) {
  const [eventTime, setEventTime] = useState<EventTimeType>();
  const [availableCount, setAvailableCount] = useState<number[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const timeResponse = await fetch(`/api/availableTime/${eventId}`);
      const userResponse = await fetch(
        `/api/availableTime/${eventId}?username=${username}`,
      );
      const eventResponse = await fetch(`/api/activities/${eventId}`);

      const timeData = await timeResponse.json();
      const userData = await userResponse.json();
      const eventData = await eventResponse.json();

      // console.log(eventData)
      const eventTime = {
        startTime: new Date(eventData.activityData.startTime),
        endTime: new Date(eventData.activityData.endTime),
      };

      const timeCounter = timeData.counter.map((val: number, index: number) =>
        valid(index, eventTime.startTime, eventTime.endTime) ? val : -1,
      );
      const isUserAvailable = userData.counter.map((val: number) =>
        val > 0 ? true : false,
      );

      setEventTime(eventTime);
      setAvailableCount(timeCounter);
      setIsAvailable(isUserAvailable);
    };

    fetchData();
  }, [eventId, username, isParticipating]);

  return {
    eventTime,
    availableCount,
    isAvailable,
    setAvailableCount,
    setIsAvailable,
  };
}
