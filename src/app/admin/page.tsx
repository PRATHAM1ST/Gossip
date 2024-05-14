"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { createReaction } from "@/utils/Admin/createReaction";
import { getReactions } from "@/utils/Reaction/getReactions";
import { GossipsType } from "@/utils/Gossip/getGossips";
import { getReportedPosts } from "@/utils/Admin/reportedPosts";
import { Prisma } from "@prisma/client";
import { getTempImages } from "@/utils/Admin/getTempImages";
import { CldImage } from "next-cloudinary";
import { DeleteImage } from "../new/components/delete";
import Link from "next/link";
import { deletePost } from "@/utils/Admin/deletePost";
import { removeTempImageUpload } from "@/utils/Temp/removeTempImageUpload";
import { deleteReaction } from "@/utils/Admin/deleteReaction";

export default function Admin() {
	const [reactions, setReactions] = React.useState<
		{
			id: string;
			emojie: string;
			description: string;
		}[]
	>([]);

	const [reportedPosts, setReportedPosts] = React.useState<
		| {
				id: string;
				createdAt: Date;
				reason: string;
				postId: string;
				post: {
					id: string;
					title: string;
					content: string;
				};
		  }[]
		| null
	>(null);

	const [tempImages, setTempImages] = React.useState<
		| {
				id: string;
				createdAt: Date;
				updatedAt: Date;
				imageData: Prisma.JsonValue;
		  }[]
		| null
	>(null);

	React.useEffect(() => {
		(async () => {
			getReactions().then((res) => setReactions(res));
			getReportedPosts().then((res) => setReportedPosts(res));
			getTempImages().then((res) => setTempImages(res));
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

		getReactions().then((res) => setReactions(res));
	}

	async function handleTempImageDelete(tempImageData: any, tempid: string) {
		const public_id = tempImageData.info.public_id;
		const res = await DeleteImage(public_id);
		if (res?.status) {
			setTempImages(
				(prev) =>
					prev?.filter(
						(tempImage) =>
							tempImage.imageData?.info.public_id !== public_id
					) || null
			);
			removeTempImageUpload(tempid);
		} else {
			console.log("Error deleting image");
		}
	}

	async function handleTempImagesDeleteOlderThanADay() {
		if (tempImages) {
			tempImages.forEach(async (tempImage) => {
				if (
					Math.floor(
						(new Date().getTime() -
							new Date(tempImage.createdAt).getTime()) /
							(1000 * 60 * 60 * 24)
					) > 1
				) {
					const public_id = tempImage.imageData?.info.public_id;
					const res = await DeleteImage(public_id);
					if (res?.status) {
						setTempImages(
							(prev) =>
								prev?.filter(
									(tempImage) =>
										tempImage.imageData?.info.public_id !==
										public_id
								) || null
						);
						removeTempImageUpload(tempImage.id);
					} else {
						console.log("Error deleting image");
					}
				}
			});
		}
	}

	async function handleDeleteReaction(reactionId: string) {
		await deleteReaction(reactionId);
		setReactions((prev) => prev.filter((reaction) => reaction.id !== reactionId));
	}

	return (
		<div className="container grid gap-5 mb-5 mx-auto px-4 max-w-4xl">
			<Header />
			<div>
				<h1 className="text-4xl font-bold text-center mt-10">
					Admin Page
				</h1>
				<h3 className="text-lg font-bold text-center text-slate-500 mt-5">
					Add Emojie Reaction to DB
				</h3>
				<div className="flex flex-wrap justify-between gap-6 my-4">
					{reactions ? (
						reactions.map((reaction, idx: number) => (
							<div key={reaction.id} className="flex items-center gap-4 text-3xl rounded outline p-2">
								<p>{reaction.emojie}</p>
								<p className="text-xl">{reaction.description}</p>
								<Button size="sm" variant="destructive" onClick={(()=>handleDeleteReaction(reaction.id))}>
									Delete
								</Button>
							</div>
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
					<div className="input grid gap-3 mx-auto">
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

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-bold text-center text-slate-500 mt-5">
					Reported Posts
				</h3>
				{reportedPosts ? (
					reportedPosts.map((report, idx: number) => (
						<div
							key={report.id}
							className="flex flex-col gap-3 border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1"
						>
							<p>
								Post Id <br />
								<b> {report.postId}</b>
							</p>
							<p>
								Reason
								<br /> <b>{report.reason}</b>
							</p>
							<p>
								Title Of Post
								<br />
								<b> {report.post.title} </b>
							</p>
							<p>
								Reported At <br />
								<b>
									{new Date(
										report.createdAt
									).toLocaleDateString()}
								</b>
							</p>
							<div className="flex gap-4">
								<Link href={`/view/${report.postId}`}>
									<Button
										variant="secondary"
										className="my-4"
									>
										View Post
									</Button>
								</Link>
								<Button
									variant="destructive"
									className="my-4"
									onClick={() => deletePost(report.postId)}
								>
									Delete Post
								</Button>
							</div>
						</div>
					))
				) : (
					<>None</>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<h3 className=" flex justify-between items-center text-lg font-bold text-center text-slate-500 mt-5">
					Temp Images
					<Button
						variant="destructive"
						onClick={handleTempImagesDeleteOlderThanADay}
					>
						{" "}
						Delete All Temp Images Older Than a Day
					</Button>
				</h3>
				{tempImages ? (
					tempImages.map((tempImage, idx: number) => (
						<div
							key={tempImage.id}
							className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1"
						>
							<p>
								Image Id:{" "}
								<b> {tempImage.imageData?.info.public_id}</b>
							</p>
							<p>
								{" "}
								Time Passed:{" "}
								<b>
									{Math.floor(
										(new Date().getTime() -
											new Date(
												tempImage.createdAt
											).getTime()) /
											(1000 * 60 * 60 * 24)
									)}{" "}
									Days{" "}
									{Math.floor(
										(new Date().getTime() -
											new Date(
												tempImage.createdAt
											).getTime()) /
											(1000 * 60 * 60)
									) % 24}{" "}
									Hours {" "}
									{
										Math.floor((new Date().getTime() -
											new Date(
												tempImage.createdAt
											).getTime()) /
										(1000 * 60))
									}{" "}
									Minutes
								</b>
							</p>
							{/*  */}
							<CldImage
								id={
									typeof tempImage.imageData !== "string"
										? tempImage.imageData?.info.id
										: undefined
								}
								height={
									typeof tempImage.imageData !== "string"
										? tempImage.imageData?.info.height
										: undefined
								}
								width={
									typeof tempImage.imageData !== "string"
										? tempImage.imageData?.info.width
										: undefined
								}
								src={
									typeof tempImage.imageData !== "string"
										? tempImage.imageData?.info.public_id
										: undefined
								}
								sizes="100vw"
								alt="Description of my image"
								className="h-auto w-full rounded-md peer"
							/>
							<Button
								variant="destructive"
								className="my-4"
								onClick={() =>
									handleTempImageDelete(
										tempImage.imageData,
										tempImage.id
									)
								}
							>
								Delete Image
							</Button>
						</div>
					))
				) : (
					<>None</>
				)}
			</div>
		</div>
	);
}
