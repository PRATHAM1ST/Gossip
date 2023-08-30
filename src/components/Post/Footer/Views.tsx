"use client";

import { useEffect } from "react";
import { increasePostViewCount } from "@/utils/Gossip/View/increasePostViewCount";

export default function ViewsIncrementer({
	userId,
	postId,
	views,
}: {
	userId: string;
	postId: string;
	views: object[];
}) {
	useEffect(() => {
		if (!userId) return;
		if (process.env.NODE_ENV !== "development") {
			increasePostViewCount({
				postId: postId,
				userId: String(userId),
			})
				.then((res) => {
					if (res.success) throw new Error(res.message);
				})
				.catch((err) => {
					console.error(err);
				});
		} // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]);

	return <>{Number(views.length) + 1} Views</>;
}
