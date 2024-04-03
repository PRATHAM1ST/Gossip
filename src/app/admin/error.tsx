"use client"; // Error components must be Client Components

import Header from "@/components/Header";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ReplayIcon from "@mui/icons-material/Replay";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="container grid gap-5 mb-5 mx-auto px-4 max-w-4xl">
			<Header />
			<div className="flex flex-col items-center justify-center mt-24">
				<h1 className="text-7xl font-bold text-center">
					Something went wrong!
				</h1>
				<h3 className="text-lg font-bold text-center text-slate-500">
					{error.message}
				</h3>
				<div className="flex gap-10">
					<a
						href="/"
						className="text-2xl align-middle font-bold px-4 py-1 text-white bg-sky-500 hover:bg-sky-700 mx-auto rounded text-center mt-11"
					>
						<HomeIcon /> Home
					</a>
					<button
						onClick={reset}
						className="text-2xl align-middle font-bold px-4 py-1 text-white bg-sky-500 hover:bg-sky-700 mx-auto rounded text-center mt-11"
					>
						<ReplayIcon /> Try Again
					</button>
				</div>
			</div>
		</div>
	);
}
