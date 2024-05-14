"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { createReaction } from "@/utils/Admin/createReaction";
import { getReactions } from "@/utils/Reaction/getReactions";
import { getReportedPosts } from "@/utils/Admin/reportedPosts";
import { Prisma } from "@prisma/client";
import { getTempImages } from "@/utils/Admin/getTempImages";
import { CldImage } from "next-cloudinary";
import { DeleteImage } from "../new/components/delete";
import Link from "next/link";
import { deletePost } from "@/utils/Admin/deletePost";
import { removeTempImageUpload } from "@/utils/Temp/removeTempImageUpload";
import { deleteReaction } from "@/utils/Admin/deleteReaction";
import { useSession } from "next-auth/react";
import { checkAdmin } from "@/utils/Admin/checkAdmin";
import { deleteReport } from "@/utils/Admin/deleteReport";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function Admin() {
	const { data: session } = useSession();
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
		if (!session?.user?.email) return;
		(async () => {
			getReactions().then((res) => setReactions(res));
			getReportedPosts().then((res) => setReportedPosts(res));
			getTempImages().then((res) => setTempImages(res));
		})();
	}, [session]);

	if (
		(session &&
			session.user &&
			checkAdmin({
				email: session.user.email as string,
				token_provider:
					((session as any).token_provider as string) ?? "",
			}).success) === false
	)
		return (window.location.href = "/api/auth/signin");

	async function sendDataToServerForEmojie(
		e: React.FormEvent<HTMLFormElement>
	) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const emojie = formData.get("emojie");
		const description = formData.get("description");

		await createReaction({
			emojie: emojie as string,
			description: description as string,
		});

		form.reset();

		getReactions().then((res) => setReactions(res));

		toast("Emojie Added", {
			description: "Emojie has been added to the database",
		});
	}

	async function handleTempImageDelete(tempImageData: any, tempid: string) {
		const public_id = tempImageData.info.public_id;
		const res = await DeleteImage(public_id);
		if (res?.status) {
			setTempImages(
				(prev) =>
					prev?.filter(
						(tempImage: any) =>
							tempImage.imageData?.info.public_id !== public_id
					) || null
			);
			removeTempImageUpload(tempid);
			toast("Image Deleted", {
				description: "Image has been deleted",
			});
		} else {
			toast("Error Deleting Image", {
				description: "Error deleting image",
			});
		}
	}

	async function handleTempImagesDeleteOlderThanADay() {
		if (tempImages) {
			tempImages.forEach(async (tempImage: any) => {
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
									(tempImage: any) =>
										tempImage.imageData?.info.public_id !==
										public_id
								) || null
						);
						removeTempImageUpload(tempImage.id);
						toast("Image Deleted", {
							description: "Image has been deleted",
						});
					} else {
						toast("Error Deleting Image", {
							description: "Error deleting image",
						});
					}
				}
			});
		}
	}

	async function handleDeleteReaction(reactionId: string) {
		await deleteReaction(reactionId);
		setReactions((prev) =>
			prev.filter((reaction) => reaction.id !== reactionId)
		);
		toast("Reaction Deleted", {
			description: "Reaction has been deleted",
		});
	}

	async function handleIgnoringReport(reportId: string) {
		await deleteReport(reportId);
		setReportedPosts(
			(prev) => prev?.filter((report) => report.id !== reportId) || null
		);
		toast("Report Ignored", {
			description: "Report has been ignored",
		});
	}

	async function handleDeletePost(postId: string) {
		const res = await deletePost(postId);
		if (res.sucess) {
			setReportedPosts(
				(prev) =>
					prev?.filter((report) => report.postId !== postId) || null
			);
			toast("Post Deleted", {
				description: "Post has been deleted",
			});
		} else {
			toast("Error Deleting Post", {
				description: res.message,
			});
		}
	}

	return (
		<div className="container grid gap-8 mb-5 mx-auto px-4 max-w-4xl">
			<Header />
			<h1 className="text-4xl font-bold text-center mt-10">Admin Page</h1>
			<Separator className="bg-black dark:bg-white my-5" />
			<div>
				<h3 className="text-2xl font-bold">Add Reaction</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-6 my-4">
					{reactions ? (
						reactions.map((reaction, idx: number) => (
							<div
								key={reaction.id}
								className="flex justify-between items-center gap-4 text-3xl border-2 border-black dark:border-slate-500 p-2 rounded"
							>
								<p>{reaction.emojie}</p>
								<p className="text-xl">
									{reaction.description}
								</p>
								<Button
									size="sm"
									variant="destructive"
									onClick={() =>
										handleDeleteReaction(reaction.id)
									}
								>
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
					<div className="input flex justify-center items-end gap-8 mx-auto w-full flex-wrap md:flex-nowrap">
						<div className="flex flex-col gap-2 w-full md:w-auto">
							<label htmlFor="emojie" className="font-bold">
								Emojie*
							</label>
							<input
								type="text"
								className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1 md:w-14 w-full"
								name="emojie"
								required
							/>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<label htmlFor="description" className="font-bold">
								Emojie Explaination*
							</label>
							<input
								type="text"
								className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1 w-full"
								name="description"
								required
							/>
						</div>
						<Button type="submit" className="w-full md:w-auto">Add Emojie</Button>
					</div>
				</form>
			</div>

			<Separator className="bg-black dark:bg-white my-5" />

			<div className="flex flex-col gap-4">
				<h3 className="text-2xl font-bold">Reported Posts</h3>
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
							<div className="flex gap-4 flex-wrap">
								<Link href={`/view/${report.postId}`}>
									<Button
										variant="secondary"
										className="my-4"
									>
										View Post
									</Button>
								</Link>
								<Button
									variant="outline"
									className="my-4"
									onClick={() =>
										handleIgnoringReport(report.id)
									}
								>
									Ignore Report
								</Button>
								<Button
									variant="destructive"
									className="my-4"
									onClick={() => handleDeletePost(report.postId)}
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

			<Separator className="bg-black dark:bg-white my-5" />

			<div className="flex flex-col gap-4">
				<h3 className=" flex justify-between items-center text-3xl font-bold mt-5 flex-wrap">
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
					tempImages.map((tempImage: any, idx: number) => (
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
									Hours{" "}
									{Math.floor(
										(new Date().getTime() -
											new Date(
												tempImage.createdAt
											).getTime()) /
											(1000 * 60)
									)}{" "}
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
								className="h-auto w-full object-fill rounded-md peer"
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
