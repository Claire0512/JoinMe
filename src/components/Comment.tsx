import * as React from "react";

import SnackbarContent from "@mui/material/SnackbarContent";

type CommentProps = {
  id: number;
  // key: number;
  userHandle: string;
  content: string;
  createdAt: Date;
  replyToActivityId: number;
  userName: string;
};

// note that the Comment component is also a server component
// all client side things are abstracted away in other components
export default function Comment({ content, userName }: CommentProps) {
  return (
    <SnackbarContent
      message={`${userName} : ${content}`}
      sx={{
        ".MuiSnackbarContent-message": {
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          maxWidth: "100%",
        },
      }}
    />
  );
}
