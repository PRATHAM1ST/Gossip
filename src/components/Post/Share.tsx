"use client";

import { useState } from "react";
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	PinterestShareButton,
	RedditShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import RedditIcon from "@mui/icons-material/Reddit";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Share({ id, title }: { id: string; title: string }) {
	const shareUrl = `https://onlygossips.pratham-chudasama.co/view/${id}`;
	const message = `Watch this Gossip on OnlyGossips\n\n${title}\n\nTell use what you think about this gossip.\nComment on OnlyGossips\n`;
	return (
		<div>
			<Dialog>
				<DialogTrigger className="aspect-square absolute left-full top-0 translate-y-2/4 -translate-x-2/4 ">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Badge variant={"outline"} className="flex justify-center items-center bg-white dark:bg-slate-950 p-4">
									<ShareRoundedIcon
										fontSize="large"
										className="-translate-x-[5%]"
									/>
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p>Share this Post</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<div className="flex gap-5">
							<ContentCopyIcon
								className="cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(shareUrl);
								}}
							/>
							<WhatsappShareButton title={message} url={shareUrl}>
								<WhatsAppIcon />
							</WhatsappShareButton>
							<TwitterShareButton title={message} url={shareUrl}>
								<TwitterIcon />
							</TwitterShareButton>
							<LinkedinShareButton title={message} url={shareUrl}>
								<LinkedInIcon />
							</LinkedinShareButton>
							<TelegramShareButton title={message} url={shareUrl}>
								<TelegramIcon />
							</TelegramShareButton>
							<RedditShareButton title={message} url={shareUrl}>
								<RedditIcon />
							</RedditShareButton>
							<FacebookShareButton title={message} url={shareUrl}>
								<FacebookIcon />
							</FacebookShareButton>
							<PinterestShareButton
								title={message}
								url={shareUrl}
								media="https://onlygossips.pratham-chudasama.co/api/og"
							>
								<PinterestIcon />
							</PinterestShareButton>
							<EmailShareButton
								title={message}
								url={shareUrl}
								subject={title + " @ OnlyGossips"}
								body={message}
							>
								<EmailIcon />
							</EmailShareButton>
						</div>
						<br />
						<DialogTitle>
							Share this post to others too...
						</DialogTitle>
						<DialogDescription>
							Watch this Gossip on OnlyGossips
							<br />
							{title}
							<br />
							Tell use what you think about this gossip.
							<br />
							Comment on OnlyGossips
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}
