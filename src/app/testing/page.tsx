"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dataCleaning } from "@/data-preprocessing/preprocessing";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function Testing() {
	const [search, setSearch] = useState<string>("");

	function handleSubmitandGetSearchInput(
		event: React.FormEvent<HTMLFormElement>
	) {
		event.preventDefault();
		const target = event.target as HTMLFormElement & {
			search: { value: string };
		};
		const search = dataCleaning(target.search.value);

		setSearch(search);

		target.reset();
	}

	console.log('search', search);

	return (
		<div className="container grid gap-5 mb-5 mx-auto px-4 max-w-4xl">
			<Header />
			<form
				className="flex w-full max-w-sm items-center space-x-2"
				onSubmit={handleSubmitandGetSearchInput}
			>
				<Input type="text" placeholder="Search" name="search" />
				<Button type="submit">
					<MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</form>
			<div>{search}</div>
		</div>
	);
}
