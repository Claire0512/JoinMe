"use client";

import {useState } from "react";

import useAvailableTimes from "@/hooks/useAvailableTimes";
import { datesBetween} from "@/lib/utils";

type TimetableProps = {
  isParticipating: boolean;
  userHandle: string;
  activityId: number;
  participationCount: number;
};

function style(
  cellNumber: number,
  totalNumber: number,
) {
  if (cellNumber == -1) {
    return "bg-gray-500";
  }
  if (cellNumber == 0) {
    return "bg-gray-300";
  } else {
    const ratio = cellNumber / totalNumber;
    let retStyle;
    const colors = [
      "bg-blue-300",
      "bg-blue-400",
      "bg-blue-500",
      "bg-blue-600",
      "bg-blue-700",
      "bg-blue-800",
    ];
    for (let i = 1; i <= 6; i++) {
      if (ratio <= i / 6 + 1e-6) {
        retStyle = colors[i - 1];
        break;
      }
    }
    return retStyle;
  }
}

function hover(isAvailable: boolean, isHovering: boolean) {
  return isAvailable && isHovering ? "border-2 border-purple-300 " : "";
}

function Timetable({
  isParticipating,
  userHandle,
  activityId,
  participationCount,
}: TimetableProps) {
  const {
    eventTime,
    availableCount,
    isAvailable,
    setAvailableCount,
    setIsAvailable,
  } = useAvailableTimes(activityId, userHandle, isParticipating);

  const [isHovering, setIsHovering] = useState(false);

  if (!eventTime || availableCount.length == 0) {
    return <div>Loading...</div>;
  }

  const dates = datesBetween(eventTime.startTime, eventTime.endTime);
  const onCellClick = async (index: number) => {
    if (!isParticipating) return;
    if (availableCount[index] == -1) return;

    const newAvailable = [...isAvailable];
    const newCount = [...availableCount];

    const postData = {
      userHandle,
      activityId,
      availableTime: index,
      isInserting: !isAvailable[index],
    };
   // console.log("postData: ", postData);
    const response = await fetch(`/api/availableTime/${activityId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
   // console.log("response: ", response);
    if (!response.ok) {
      const body = await response.json();
      alert(body.error);
      return;
    }

    if (isAvailable[index]) {
      newAvailable[index] = false;
      newCount[index] -= 1;
    } else {
      newAvailable[index] = true;
      newCount[index] += 1;
    }

    setIsAvailable(newAvailable);
    setAvailableCount(newCount);
  };

  return (
    <div className="flex-col items-center justify-center">
      <table
        className="min-w-full divide-y divide-gray-200"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"></th>{" "}
            {/* Empty cell */}
            {dates.map((date) => (
              <th
                key={date}
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array(24)
            .fill(0)
            .map((_, hour) => (
              <tr key={hour}>
                <td className="whitespace-nowrap px-1 py-1 text-center text-xs">
                  {String(hour).padStart(2, "0")}
                </td>
                {dates.map((date, dateIndex) => (
                  <td
                    key={date}
                    className={`cursor-pointer whitespace-nowrap border border-white px-6 py-1 
                      ${style(
                        availableCount[dateIndex * 24 + hour],
                        participationCount,
                      )}
                      ${hover(isAvailable[dateIndex * 24 + hour], isHovering)}`}
                    onClick={() => onCellClick(dateIndex * 24 + hour)}
                  ></td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-center">
        <span className="px-2 text-xs"> 0/{participationCount} </span>
        <table>
          <tbody>
            <tr key="only">
              {Array(+participationCount + 1)
                .fill(0)
                .map((_, index) => (
                  <td
                    key={index}
                    className={`cursor-pointer whitespace-nowrap border border-white px-6 py-2 
                        ${style(index, participationCount)}`}
                  ></td>
                ))}
            </tr>
          </tbody>
        </table>
        <span className="px-2 text-xs">
          {participationCount}/{participationCount}
        </span>
      </div>
    </div>
  );
}

export default Timetable;
