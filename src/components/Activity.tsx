import * as React from "react";

import Link from "next/link";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type ActivitiesProps = {
  username?: string;
  handle?: string;
  id: number;
  content: string;
  attended?: boolean;
  attendance: number;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Activity({
  username,
  handle,
  id,
  content,
 
  attended,
  attendance,
}: ActivitiesProps) {
  //console.log(username, handle);
  return (
    <Link
      href={{
        pathname: `/activity/${id}`,
        query: {
          username,
          handle,
        },
      }}
    >
      <ListItemButton>
        <ListItemText
          primary={content}
          secondary={`${attendance + 0} 人參加`}
        />
        <ListItemIcon>
          {attended ? (
            <CheckIcon style={{ color: "green" }} />
          ) : (
            <CloseIcon style={{ color: "red" }} />
          )}
        </ListItemIcon>
      </ListItemButton>
    </Link>
  );
}
