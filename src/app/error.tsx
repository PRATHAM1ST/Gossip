"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import HomeIcon from "@mui/icons-material/Home";
import ReplayIcon from "@mui/icons-material/Replay";
import Link from "next/link";
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
		<div className="absolute inset-0 m-auto container grid gap-5 mb-5 mx-auto px-4 max-w-4xl">
			<div className="flex flex-col items-center justify-center mt-24">
				<h1 className="text-5xl md:text-7xl font-bold text-center">
					Something went wrong!
				</h1>
				<div className="flex gap-10">
					<Button>
						<Link
							href="/"
							// className="text-2xl align-middle font-bold px-4 py-1 text-white bg-sky-500 hover:bg-sky-700 mx-auto rounded text-center mt-11"
						>
							<HomeIcon /> Home
						</Link>
					</Button>

					<Button
						onClick={reset}
						// className="text-2xl align-middle font-bold px-4 py-1 text-white bg-sky-500 hover:bg-sky-700 mx-auto rounded text-center mt-11"
					>
						<ReplayIcon /> Try Again
					</Button>
				</div>
			</div>
		</div>
	);
}
