import Header from "@/components/Header";
import { getSingleGossip } from "@/utils/Gossip/getSingleGossip";
import { ReactionsType, getReactions } from "@/utils/Reaction/getReactions";
import NotFound from "./not-found";
import SingleGossip from "@/components/Post/SingleGossip";
import { GossipsType } from "@/utils/Gossip/getGossips";

export default async function Home({ params }: { params: { id: string } }) {
	const gossip : GossipsType | null = await getSingleGossip(params.id);
	const reactions : ReactionsType[] = await getReactions();

	if (!gossip) return <NotFound />;

	return (
		<div className="container grid gap-5 mb-5 mx-auto px-4 max-w-4xl">
			<Header />
			<SingleGossip gossip={gossip} reactions={reactions} />
		</div>
	);
}
