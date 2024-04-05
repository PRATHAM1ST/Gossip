"use client";

import { useEffect } from "react";
import { increasePostViewCount } from "@/utils/Gossip/View/increasePostViewCount";

export default function ViewsIncrementer({
	userEmail,
	postId,
	views,
}: {
	userEmail: string;
	postId: string;
	views: object[];
}) {
	useEffect(() => {
		console.log('increasePostViewCount called');
		increasePostViewCount({
			postId: postId,
			userEmail: userEmail,
		})
			.then((res) => {
				if (!res.success) throw new Error(res.message);
			})
			.catch((err) => {
				console.error(err);
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{Number(views.length)} Views</>;
}
