"use client";

import { useState } from "react";
import * as React from "react";

import { Textarea } from "@mui/joy";
import Button from "@mui/joy/Button";

import UserAvatar from "@/components/UserAvatar";
import useComment from "@/hooks/useComment";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type ReplyInputProps = {
  replyToActivityId: number;
  replyToHandle: string;
  attended: boolean;
};

export default function ReplyInput({
  replyToActivityId,
  attended,
}: ReplyInputProps) {
  const { handle, username } = useUserInfo();
  const [textareaValue, setTextareaValue] = useState("");

  const { postComment, loading } = useComment();

  const handleReply = async (content: string) => {
    // console.log("Textarea value:", textareaRef.current?.value);
    // const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    try {
      await postComment({
        handle,
        content,
        replyToActivityId,
      });
      setTextareaValue("");
    } catch (e) {
     // console.error(e);
      alert("Error posting reply");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (attended && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReply(textareaValue);
    }
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <UserAvatar className="mr-4 h-12 w-12 p-0" />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleReply(textareaValue);
          }}
        >
          <Textarea
            placeholder={`${username} 留下你的想法吧！`}
            onChange={(e) => setTextareaValue(e.target.value)}
            value={textareaValue}
            required
            sx={{ mb: 1 }}
            name="input"
            disabled={!attended}
            onKeyPress={handleKeyPress}
          />
          {/* <Button type="submit"> press me </Button> */}
          <Button
            type="submit"
            className={cn(
              "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
              "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
            )}
            // onClick={handleReply}
            disabled={!attended || loading}
          >
            {attended ? "留言" : "加入活動即可參與討論"}
          </Button>
        </form>
      </div>
    </div>
  );
}
