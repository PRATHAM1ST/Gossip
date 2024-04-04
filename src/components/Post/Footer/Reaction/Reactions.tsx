"use client";

import React, { useEffect, useState } from "react";
import ReactionAdder from "./ReactionAdder";
import { ReactionsType } from "@/utils/Reaction/getReactions";
import { checkUserPostReaction } from "@/utils/User/checkUserPostReaction";
import { useSession } from "next-auth/react";

export default function Reactions({
	postId,
	reactionsOnPost,
	defaultReactionAdderArray,
	setReactionsOnPostCount,
}: {
	userId: string;
	postId: string;
	reactionsOnPost: ReactionsType[];
	defaultReactionAdderArray: ReactionsType[];
	setReactionsOnPostCount: any;
}) {
	const [postReactions, setPostReactions] =
		useState<ReactionsType[]>(reactionsOnPost);
	const [currentReaction, setCurrentReaction] = useState<{
		id: string;
		emojie: string;
		userId: string;
	} | null>(null);

	const { data: session } = useSession();

	const getCurrentUserReaction = () => {
		if (!session?.user?.email) return;

		checkUserPostReaction({
			userEmail: session?.user?.email as string,
			postId: postId,
		})
			.then((res) => {
				if (!res.success) {
					throw res.message;
				}
				setCurrentReaction({
					id: res.reactionId as string,
					emojie: res.emojie as string,
					userId: res.userId as string,
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	useEffect(() => {
		getCurrentUserReaction(); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	useEffect(() => {
		setPostReactions(reactionsOnPost);
	}, [currentReaction, reactionsOnPost]);

	console.log(postReactions);

	return (
		<div className="reactions flex text-2xl items-center justify-center">
			{postReactions
				.slice(0)
				.slice(-5)
				.map(
					(reaction: any, idx: number) =>
						reaction.userId !== currentReaction?.userId && (
							<div className="-ml-5" key={idx}>
								{reaction.emojie}
							</div>
						)
				)}
			<ReactionAdder
				setReactionsOnPostCount={setReactionsOnPostCount}
				postId={postId}
				reactions={defaultReactionAdderArray}
				currentReaction={currentReaction}
				setCurrentReaction={setCurrentReaction}
				setPostReactions={setPostReactions}
			/>
		</div>
	);
}
