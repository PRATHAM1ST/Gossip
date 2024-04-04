"use client";

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { inter } from "../fonts";
import { getReactions } from "@/utils/Reaction/getReactions";
import { RequestType, createPost } from "@/utils/Gossip/Create/createPost";
import Header from "@/components/Header";
import { CldUploadButton } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import { DeleteImage } from "./components/delete";
import CloseIcon from "@mui/icons-material/Close";
import { addTempImageUpload } from "@/utils/Temp/addTempImageUpload";
import { removeTempImageUpload } from "@/utils/Temp/removeTempImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

type Reactions = {
	id: string;
	emojie: string;
};

type UploadResponse = {
	event: string;
	info: {
		id: string;
		batchId: string;
		asset_id: string;
		public_id: string;
		version: number;
		version_id: string;
		signature: string;
		width: number;
		height: number;
		format: string;
		resource_type: string;
		created_at: string;
		tags: string[];
		bytes: number;
		type: string;
		etag: string;
		placeholder: boolean;
		url: string;
		secure_url: string;
		folder: string;
		access_mode: string;
		original_filename: string;
		path: string;
		thumbnail_url: string;
	};
};

export default function New() {
	const [reactions, setReactions] = useState<Reactions[]>();
	const [gossip, setGossip] = useState<string>("");
	const [emojie, setEmojie] = useState<number>(0);
	const [postingDataLoading, setPostingDataLoading] =
		useState<boolean>(false);
	const [uploadResponses, setUploadResponses] = useState<UploadResponse[]>(
		[]
	);
	const { data: session } = useSession();

	const handleUpload = async (e: any) => {
		const tempid = await addTempImageUpload(e).then((res) => res.id);
		setUploadResponses((prev) => [...prev, { ...e, tempid: tempid }]);
	};

	const handleDelete = async (uploadResponse: any) => {
		const public_id = uploadResponse.info.public_id;
		const tempid = uploadResponse.tempid;
		const res = await DeleteImage(public_id);
		if (res?.status) {
			setUploadResponses((prev) =>
				prev.filter((upload) => upload.info.public_id !== public_id)
			);
			removeTempImageUpload(tempid);
		} else {
			console.log("Error deleting image");
		}
	};

	useEffect(() => {
		getReactions().then((data: Reactions[]) => {
			setReactions(data);
		});
	}, []);

	function handleSubmit(formData: FormData) {
		setPostingDataLoading(true);
		if (gossip.split(" ").length < 10) {
			setPostingDataLoading(false);
			return;
		}
		const title = String(formData.get("title"));
		const content = gossip as string;
		const backgroundEmoji = String(formData.get("emojie"));
		const data: RequestType = {
			title,
			content,
			backgroundEmoji,
			images: uploadResponses,
		};

		createPost(data)
			.then(async (res) => {
				if (!res.sucess) {
					throw res.message;
				}
				formData.delete("title");
				formData.delete("emojie");
				setGossip("");

				uploadResponses.forEach(async (uploadResponse: any) => {
					await removeTempImageUpload(uploadResponse.tempid);
				});

				window.location.href = "/";
			})
			.catch((err) => {
				console.log("err", err);
			})
			.finally(() => {
				setPostingDataLoading(false);
			});
	}

	const handleChecked = (e: any) => {
		console.log("e", e.target.value);
	};

	return (
		<div className="container mx-auto px-4 max-w-4xl">
			<Header removeAdder={true} />
			<form
				className={`grid gap-3 max-w-2xl mx-auto ${
					postingDataLoading
						? "cursor-not-allowed select-none animate-pulse"
						: ""
				}`}
				action={handleSubmit}
			>
				<div className="input grid">
					<label htmlFor="title" className="font-bold">
						Title of the Gossip*
					</label>
					<Input
						id="title"
						type="text"
						className="border-2 border-black dark:border-slate-500 dark:bg-slate-900 rounded px-4 py-1"
						data-title="Title of the Gossip"
						name="title"
						disabled={postingDataLoading}
						required
					/>
				</div>
				<div className="input grid gap-1">
					<label htmlFor="gossip" className="font-bold">
						Gossip*
					</label>
					<div className="text-red-500 text-xs">
						{gossip.split(" ").length < 10
							? "Atleast 10 words needed"
							: ""}
					</div>
					<ReactQuill
						className={`${
							inter.className
						} border-2 border-black rounded first:border-2 relative flex flex-col h-fit ${
							postingDataLoading
								? "cursor-not-allowed select-none"
								: ""
						}
						dark:border-slate-500
						dark:bg-slate-900
						dark:text-white
						`}
						theme="snow"
						value={gossip}
						onChange={setGossip}
						placeholder="Write your gossip here..."
					/>
				</div>
				<div className="emojie-selection">
					<label htmlFor="gossip" className="font-bold">
						Background Reaction*
					</label>
					<div className="flex gap-3 my-4">
						{reactions ? (
							reactions.map((reaction: any, idx: number) => (
								<span key={reaction.id}>
									<label
										className={`cursor-pointer ${
											emojie === idx
												? "text-3xl border-2 border-black dark:border-white rounded-full p-1"
												: "text-lg"
										}`}
										htmlFor={reaction.id}
									>
										{reaction.emojie}
									</label>
									<input
										key={reaction.id}
										id={reaction.id}
										className="peer hidden"
										type="radio"
										name="emojie"
										checked={emojie === idx}
										onChange={() => setEmojie(idx)}
										value={reaction.emojie}
										disabled={postingDataLoading}
									/>
								</span>
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
				</div>

				<div>
					<label htmlFor="gossip" className="font-bold">
						Upload Image(s){" "}
						<span className="text-xs font-light">(Optional)</span>
					</label>
					<div className="flex gap-3 items-center my-3">
						<CldUploadButton
							className="p-20 outline-dashed dark:outline-slate-500 rounded dark:bg-slate-900 bg-slate-100"
							uploadPreset="gossip"
							onUpload={handleUpload}
							options={{
								clientAllowedFormats: [
									"png",
									"gif",
									"jpeg",
									"jpg",
									"webp",
									"heic",
									"heif",
								],
								sources: [
									"local",
									"camera",
									"google_drive",
									"instagram",
									"facebook",
								],
							}}
						/>
						<div className="flex gap-6 flex-wrap my-4 items-center ease-in-out duration-300">
							{uploadResponses?.map((uploadResponse) => (
								<div
									key={uploadResponse.info.id}
									className="relative"
								>
									<label
										htmlFor={uploadResponse.info.id}
										className="absolute z-40 top-0 right-0 translate-x-2/4 -translate-y-2/4 text-xs p-1 w-5 h-5 flex justify-center items-center font-bold text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
										onClick={() =>
											handleDelete(uploadResponse)
										}
									>
										<CloseIcon
											className="text-xs"
											style={{
												fontSize: "0.75rem",
											}}
										/>
									</label>
									<CldImage
										id={uploadResponse.info.id}
										height={uploadResponse.info.height}
										width={uploadResponse.info.width}
										src={uploadResponse.info.public_id}
										sizes="100vw"
										alt="Description of my image"
										onClick={() =>
											handleDelete(
												uploadResponse.info.public_id
											)
										}
										className="w-20 h-fit rounded-md peer"
									/>
								</div>
							))}
						</div>
					</div>
				</div>

				<Button className="my-5 mb-8" type="submit">Submit</Button>
			</form>
		</div>
	);
}
