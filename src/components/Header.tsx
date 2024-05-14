import Link from "next/link";
import { gotham, margurite } from "@/app/fonts";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/toggle-theme";

export default function Header({ removeAdder = false }) {
	return (
		<header className="flex justify-between items-center my-5">
			<Link href="/" className={"text-xl md:text-3xl"}>
				<span className={gotham.className}>Only</span>
				{/* <span className={margurite.className + " text-sky-500"}> */}
				<span className={margurite.className + " text-green-900"}>
					Gossips
				</span>
			</Link>
			<div className="flex gap-3 justify-center items-center">
				<ThemeToggle />
				{removeAdder ? (
					<div onClick={() => window.history.back()}>
						<Button variant={"destructive"}>Cancel</Button>
					</div>
				) : (
					<Link href="/new">
						<Button>Add Gossip</Button>
					</Link>
				)}
			</div>
		</header>
	);
}
