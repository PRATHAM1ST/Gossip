"use client";

import { useEffect, useState } from "react";
import Reactions from "./Reaction/Reactions";
import Report from "./Report";
import { GossipsType } from "@/utils/Gossip/getGossips";
import { ReactionsType } from "@/utils/Reaction/getReactions";
import { useSession } from "next-auth/react";
import { incrementViewGetUserReaction } from "@/utils/Gossip/Footer/incrementViewGetUserReaction";

export default function PostFooter({
	gossip,
	reactions,
}: {
	gossip: GossipsType;
	reactions: ReactionsType[];
}) {
	const { data: session } = useSession();

	const [reactionsOnPostCount, setReactionsOnPostCount] = useState<number>(
		gossip.reactions?.length ?? 0
	);

	const [views, setViews] = useState<Number | null>(null);
	const [userReaction, setUserReaction] = useState<{
		id: string;
		emojie: string;
		userId: string;
	} | null>(null);

	useEffect(() => {
		if (!session?.user?.email) return;

		setViews(gossip.views?.length ?? 0);

		incrementViewGetUserReaction({
			postId: gossip.id,
			userEmail: session?.user?.email as string,
		})
			.then((res) => {
				if (!res.success) {
					throw new Error(res.message);
				}
				if (!res.reactionId) return;
				
				setUserReaction({
					id: res.reactionId,
					emojie: res.emojie,
					userId: res.userId,
				});
			})
			.catch((err) => {
				console.error(err);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	if (!session?.user?.email) return null;

	return (
		<div className="container-footer flex justify-between items-center mt-4">
			<Report postId={gossip.id} />
			<div className="stats font-bold text-neutral-500 text-xs">
				{Number(views)} Views
				{" • "}
				{reactionsOnPostCount} Reactions
			</div>
			<Reactions
				userReaction={userReaction}
				setUserReaction={setUserReaction}
				userEmail={session.user.email as string}
				setReactionsOnPostCount={setReactionsOnPostCount}
				postId={gossip.id}
				reactionsOnPost={gossip.reactions ?? []}
				defaultReactionAdderArray={reactions}
			/>
		</div>
	);
}
