"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { createReaction } from "@/utils/Reaction/createReaction";
import { getReactions } from "@/utils/Reaction/getReactions";

export default function Admin() {
	const [reactions, setReactions] = React.useState<
		{
			id: string;
			emojie: string;
		}[]
	>([]);

	React.useEffect(() => {
		(async () => {
			getReactions().then((res) => setReactions(res));
		})();
	}, []);

	async function sendDataToServerForEmojie(
		e: React.FormEvent<HTMLFormElement>
	) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		console.log("form: ", form);
		const formData = new FormData(form);
		const emojie = formData.get("emojie");
		const description = formData.get("description");

		await createReaction({
			emojie: emojie as string,
			description: description as string,
		});

		form.reset();
	}

	return (
		<div className="container mx-auto px-4 max-w-4xl">
			<Header />
			<h1 className="text-4xl font-bold text-center mt-10">Admin Page</h1>
			<h3 className="text-lg font-bold text-center text-slate-500 mt-5">
				Add Emojie Reaction to DB
			</h3>
			<div className="flex gap-3 my-4">
				{reactions ? (
					reactions.map((reaction: any, idx: number) => (
						<span key={reaction.id}>{reaction.emojie}</span>
					))
				) : (
					<div className="animate-pulse flex gap-3 my-3">
						<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
						<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
						<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
						<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
					</div>
				)}
			</div>
			<form onSubmit={sendDataToServerForEmojie}>
				<div className="input grid gap-3 max-w-2xl mx-auto">
					<label htmlFor="emojie" className="font-bold">
						Emojie*
					</label>
					<input
						type="text"
						className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1"
						name="emojie"
						required
					/>
					<label htmlFor="description" className="font-bold">
						Emojie Explaination*
					</label>
					<input
						type="text"
						className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1"
						name="description"
						required
					/>
					<Button type="submit">Add Emojie</Button>
				</div>
			</form>
		</div>
	);
}
