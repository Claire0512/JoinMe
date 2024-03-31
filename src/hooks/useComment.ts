import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useComment() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postComment = async ({
    handle,
    content,
    replyToActivityId,
  }: {
    handle: string;
    content: string;
    replyToActivityId: number;
  }) => {
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        handle,
        content,
        replyToActivityId,
      }),
    });

  //  console.log(res.ok);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
   // console.log("HIHIHIHHI");
    setLoading(false);
  };

  return {
    postComment,
    loading,
  };
}
