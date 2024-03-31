"use client";

import {useState } from "react";
import * as React from "react";

import { useRouter } from "next/navigation";

import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import type dayjs from "dayjs";
import useActivity from "@/hooks/useActivity";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

import Profile from "./Profile";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    content: string;
    startTime: string;
    endTime: string;
  }) => void;
};

function Modal({ isOpen, onClose, onConfirm }: ModalProps) {
  const [content, setTitle] = useState("");

  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset the states when the modal is closed
      setTitle("");
      setStartTime(null);
      setEndTime(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // Format the selected date-times
    const formattedStartTime = startTime?.format("YYYY-MM-DD HH");
    const formattedEndTime = endTime?.format("YYYY-MM-DD HH");

    if (!formattedStartTime || !formattedEndTime || !content) {
      alert("Please input valid content and date");
      return;
    }

    // Ensure that the start time is before the end time
    if (startTime!.isAfter(endTime!)) {
      alert("Start time should be before end time");
      return;
    }
    if (formattedStartTime == formattedEndTime) {
      alert("Start time should not equal to end time");
      return;
    }

    // Ensure the difference between start time and end time doesn't exceed 7 days
    // const daysDifference = endTime!.diff(startTime!, "days");
    const hoursDifference = endTime!.diff(startTime!, "hours");
    if (hoursDifference > 24 * 7) {
      alert(
        "The time difference between start time and end time should not exceed 7 days",
      );
      return;
    }

    onConfirm({
      content,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 top-0 flex h-full w-full justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1000 }}
      onClick={onClose} // Close the modal when the background is clicked
    >
      <div
        className="relative mt-5 flex h-80 flex-col rounded-lg bg-white p-8"
        onClick={(e) => e.stopPropagation()} // Prevent click events from propagating to the outer div
      >
        <div className="flex-1">
          <label>
            Title:
            <input value={content} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <div style={{ display: "flex" }}>
            <label>
              From:
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem>
                  <DateTimePicker
                    // value={startTime}
                    maxDateTime={endTime}
                    onChange={(date) => setStartTime(date)}
                    // defaultValue={tomorrow}
                    // disableFuture
                    // disablePast
                    views={["year", "month", "day", "hours"]}
                  />
                </DemoItem>
              </LocalizationProvider>
            </label>
            <label>
              To:
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem>
                  <DateTimePicker
                    minDateTime={startTime}
                    // defaultValue={tomorrow}
                    onChange={(date) => setEndTime(date)}
                    // disableFuture
                    // disablePast
                    views={["year", "month", "day", "hours"]}
                  />
                </DemoItem>
              </LocalizationProvider>
            </label>
          </div>
        </div>
        <br />
        <br />
        <div className="absolute bottom-8 right-8 flex flex-row justify-end space-x-4">
          <button onClick={handleSubmit}>新增</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
export default function ActivityInput() {
  const { username, handle } = useUserInfo();
  const { postActivity, loading } = useActivity();
  const [searchTerm, setSearchTerm] = useState("");
  const hostActivities = async (data: {
    content: string;
    startTime: string;
    endTime: string;
  }) => {
   // console.log(handle);
    if (!handle) return;
   // console.log("data: ", data);

    try {
      await postActivity({
        handle,
        content: data.content,
        startTime: data.startTime,
        endTime: data.endTime,
      });
     // console.log("data: ", data);
    } catch (e) {
     // console.error(e);
      alert("Error posting activity");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalConfirm = (data: {
    content: string;
    startTime: string;
    endTime: string;
  }) => {
    setIsModalOpen(false);

    // Now call your hostActivities with the data
    hostActivities(data);
  };

  const router = useRouter();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchTerm(searchTerm);

      // Call your search function or any action you want to perform
     // console.log("Search Term:", searchTerm);
      // Implement your search logic here
      router.push(
        `/?username=${username}&handle=${handle}&searchTerm=${searchTerm}`,
      );
    }
  };

  return (
    <div className="flex gap-4">
      {/* <UserAvatar className="h-12 w-12" /> */}
      <div className="flex w-full flex-col px-2">
        {/* <Separator /> */}
        <Profile />
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search" }}
              onKeyPress={handleKeyPress}
            />
          </Search>

          <button
            className={cn(
              "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
              "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
            )}
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            新增活動
          </button>
        </Toolbar>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // If you have any other state reset logic specific to ActivityInput, you can place it here.
          }}
          onConfirm={handleModalConfirm}
        />

        {/* </div> */}
      </div>
    </div>
  );
}
