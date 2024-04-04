"use client";

import { useEffect } from "react";
import { increasePostViewCount } from "@/utils/Gossip/View/increasePostViewCount";
import { useSession } from "next-auth/react";

export default function ViewsIncrementer({
	postId,
	views,
}: {
	postId: string;
	views: object[];
}) {
	const { data: session } = useSession();
	useEffect(() => {
		console.log('increasePostViewCount called');
		increasePostViewCount({
			postId: postId,
			userEmail: session?.user?.email as string,
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
