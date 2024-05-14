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
import { toast } from "sonner";

export default function ReactionAdder({
	userEmail,
	postId,
	reactions,
	userReaction,
	setUserReaction,
	setPostReactions,
	setReactionsOnPostCount,
}: {
	userEmail: string;
	postId: string;
	reactions: ReactionsType[];
	userReaction: {
		id: string;
		emojie: string;
		userId: string;
	} | null;
	setUserReaction: any;
	setPostReactions: any;
	setReactionsOnPostCount: any;
}) {
	const handleAddingReaction = (reactionId: string) => {
		console.log("adding reaction");
		addPostReaction({
			userEmail: userEmail,
			postId: postId,
			reactionId: reactionId,
		})
			.then((res) => {
				if (!res.success) {
					throw res.message;
				}
				setReactionsOnPostCount((prev: number) =>
					userReaction === null ? (prev += 1) : prev
				);
				setUserReaction({
					id: String(res.reactionId),
					emojie: String(res.emojie),
					userId: String(userReaction?.userId),
				});
				// setPostReactions(res.updatedPostReactions);
				toast("Reaction Added", {
					description: "Your reaction has been added",
				});
			})
			.catch((err) => {
				console.log("err", err);
				toast("Error", {
					description: err,
				});
			});
	};

	const handleRemoveUserReaction = () => {
		console.log("removing reaction");

		removePostReaction({
			userEmail: userEmail,
			postId: postId,
		})
			.then((res) => {
				if (!res.success) {
					throw res.message;
				}
				setUserReaction(null);
				setReactionsOnPostCount((prev: number) => (prev -= 1));
				toast("Reaction Removed", {
					description: "Your reaction has been removed",
				});
			})
			.catch((err) => {
				console.log("err", err);
				toast("Error", {
					description: err,
				});
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

					{userReaction ? (
						<div onClick={handleRemoveUserReaction}>
							{userReaction.emojie}
						</div>
					) : (
						<FavoriteBorderIcon onClick={addHeartIcon} />
					)}
					{/* <HeartIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/> */}
				</HoverCardTrigger>
				<HoverCardContent side="top" className="flex gap-4">
					{reactions.map(
						(reaction: ReactionsType) =>
							userReaction?.id !== reaction.id && (
								<TooltipProvider key={reaction.id}>
									<Tooltip>
										<TooltipTrigger className="cursor-pointer text-2xl hover:scale-150 origin-bottom ease-in-out duration-100 align-baseline">
											<span
												className="cursor-pointer text-2xl hover:scale-125 ease-in-out duration-100 align-baseline"
												onClick={() =>
													handleAddingReaction(
														reaction.id
													)
												}
											>
												{reaction.emojie}
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{reaction?.description}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)
					)}
				</HoverCardContent>
			</HoverCard>
		</Button>
	);
}
