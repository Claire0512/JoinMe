"use client";

// export default function ProfileButton() {
//   const { username, handle } = useUserInfo();
//   const router = useRouter();
//   return (
//     <div className="flex">
//       <UserAvatar />
//       <div className="w-40 max-lg:hidden">
//         <p className="text-sm font-bold">{username ?? "..."}</p>
//         <p className="text-sm text-gray-500">{`@${handle}`}</p>
//       </div>
//       {/* <MoreHorizontal size={24} className="max-lg:hidden" /> */}
//         {/* <button
//           className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 hover:bg-gray-200"
//           // go to home page without any query params to allow the user to change their username and handle
//           // see src/components/NameDialog.tsx for more details
//           onClick={() => router.push("/")}
//         >
//         切換使用者
//         </button> */}
//         <button
//           className={cn(
//             "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
//             "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
//           )}
//           onClick={() => router.push("/")}
//         >
//           切換使用者
//         </button>
//     </div>
//   );
// }
import * as React from "react";

import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

import UserAvatar from "@/components/UserAvatar";
import useUserInfo from "@/hooks/useUserInfo";

export default function ProfileButton() {
  const { username, handle } = useUserInfo();
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          sx={{ height: "80px" }}
        >
          <div className="flex" style={{ alignItems: "center" }}>
            <UserAvatar className="h-16 w-16 p-1" />
            <div>
              <p className="text-sm font-bold">{username ?? "..."}</p>
              <p className="text-sm text-gray-500">{`@${handle}`}</p>
            </div>
          </div>
          <Button style={{ color: "white" }} onClick={() => router.push("/")}>
            切換使用者
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
