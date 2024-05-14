import Header from "../../../components/Header";
import {
	GossipsType,
	getGossips,
	GossipsResponseType,
} from "@/utils/Gossip/getGossips";
import Pagination from "@/components/Pagination";
import { ReactionsType, getReactions } from "@/utils/Reaction/getReactions";
import { Separator } from "@/components/ui/separator";
import SingleGossip from "@/components/Post/SingleGossip";


export default async function Home({ params }: { params: { page: number } }) {
	const gossipsResponse: GossipsResponseType = await getGossips({
		pageNumber: params.page,
	});

	const gossips = gossipsResponse.data;

	const reactions: ReactionsType[] = await getReactions();

	return (
		<div className="container grid gap-5 mb-5 mx-auto px-2 max-w-4xl">
			<Header />
			{gossips.map((gossip: GossipsType) => (
				<>
					<SingleGossip gossip={gossip} reactions={reactions} />
					<Separator className="bg-black dark:bg-white my-5" />
				</>
			))}
			<Pagination
				currentPage={params.page}
				totalPagesCount={Number(gossipsResponse.totalGossipsPages)}
			/>
		</div>
	);
}
