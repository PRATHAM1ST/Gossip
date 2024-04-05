"use client";

import React, { useEffect, useState } from "react";
import ReactionAdder from "./ReactionAdder";
import { ReactionsType } from "@/utils/Reaction/getReactions";

export default function Reactions({
	userReaction,
	setUserReaction,
	userEmail,
	postId,
	reactionsOnPost,
	defaultReactionAdderArray,
	setReactionsOnPostCount,
}: {
	userReaction: any;
	setUserReaction: any;
	userEmail: string;
	postId: string;
	reactionsOnPost: ReactionsType[];
	defaultReactionAdderArray: ReactionsType[];
	setReactionsOnPostCount: any;
}) {
	const [postReactions, setPostReactions] =
		useState<ReactionsType[]>(reactionsOnPost);

	useEffect(() => {
		setPostReactions(reactionsOnPost);
	}, [userReaction, reactionsOnPost]);

	return (
		<div className="reactions flex text-2xl items-center justify-center">
			{postReactions
				.slice(0)
				.slice(-5)
				.map(
					(reaction: any, idx: number) =>
						reaction.userId !== userReaction?.userId && (
							<div className="-ml-5" key={idx}>
								{reaction.emojie}
							</div>
						)
				)}
			<ReactionAdder
				userEmail={userEmail}
				setReactionsOnPostCount={setReactionsOnPostCount}
				postId={postId}
				reactions={defaultReactionAdderArray}
				userReaction={userReaction}
				setUserReaction={setUserReaction}
				setPostReactions={setPostReactions}
			/>
		</div>
	);
}
