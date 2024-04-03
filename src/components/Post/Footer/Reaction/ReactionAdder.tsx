"use client";
import { HeartIcon } from "@radix-ui/react-icons";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ReactionsType } from "@/utils/Reaction/getReactions";
import { addPostReaction } from "@/utils/Gossip/Reaction/addPostReaction";
import { removePostReaction } from "@/utils/Gossip/Reaction/removePostReaction";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReactionAdder({
	userId,
	postId,
	reactions,
	currentReaction,
	setCurrentReaction,
	setPostReactions,
	setReactionsOnPostCount,
}: {
	userId: string;
	postId: string;
	reactions: ReactionsType[];
	currentReaction: {
		id: string;
		emojie: string;
	} | null;
	setCurrentReaction: any;
	setPostReactions: any;
	setReactionsOnPostCount: any;
}) {
	const handleAddingReaction = (reactionId: string) => {
		if (!userId) return;
		console.log("adding reaction");
		addPostReaction({
			userId: String(userId),
			postId: postId,
			reactionId: reactionId,
		})
			.then((res) => {
				if (!res.success) {
					throw res.message;
				}
				setReactionsOnPostCount((prev: number) =>
					currentReaction === null ? (prev += 1) : prev
				);
				setCurrentReaction({
					id: String(res.reactionId),
					emojie: String(res.emojie),
				});
				// setPostReactions(res.updatedPostReactions);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const handleRemoveUserReaction = () => {
		console.log("removing reaction");

		removePostReaction({
			userId: userId,
			postId: postId,
		})
			.then((res) => {
				if (!res.success) {
					throw res.message;
				}
				setCurrentReaction(null);
				setReactionsOnPostCount((prev: number) => (prev -= 1));
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const addHeartIcon = () => {
		// check if user is using tablet or mobile using navigator
		// if true, return
		if (window.innerWidth < 768) return;
		handleAddingReaction(
			reactions.find((reaction) => reaction.emojie === "❤️")?.id ?? ""
		);
	};

	return (
		<Button
			className="relative add-reaction rounded-full overflow-hidden p-0"
			variant={"outline"}
		>
			<HoverCard>
				<HoverCardTrigger className="w-full h-full flex items-center aspect-square justify-center">
					{/* <AddOutlinedIcon className="m-auto" /> */}

					{currentReaction ? (
						<div onClick={handleRemoveUserReaction}>
							{currentReaction.emojie}
						</div>
					) : (
						<FavoriteBorderIcon onClick={addHeartIcon} />
					)}
					{/* <HeartIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/> */}
				</HoverCardTrigger>
				<HoverCardContent side="top" className="flex gap-4">
					{reactions.map((reaction: ReactionsType) => (
						<TooltipProvider key={reaction.id}>
							<Tooltip>
								<TooltipTrigger className="cursor-pointer text-2xl hover:scale-150 origin-bottom ease-in-out duration-100 align-baseline">
									<span
										className="cursor-pointer text-2xl hover:scale-125 ease-in-out duration-100 align-baseline"
										onClick={() =>
											handleAddingReaction(reaction.id)
										}
									>
										{currentReaction?.id === reaction.id
											? ""
											: reaction.emojie}
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>{reaction?.description}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</HoverCardContent>
			</HoverCard>
		</Button>
	);
}
