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
import { toast } from "sonner";

export default function Share({ id, title }: { id: string; title: string }) {
	const shareUrl = `https://onlygossips.prathamchudasama.com/view/${id}`;
	const message = `Watch this Gossip on OnlyGossips\n\n${title}\n\nTell use what you think about this gossip.\nComment on OnlyGossips\n`;
	return (
		<div>
			<Dialog>
				<DialogTrigger className="aspect-square md:absolute md:left-full md:top-0 md:translate-y-2/4 md:-translate-x-2/4 ">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Badge variant={"outline"} className="cursor-pointer flex justify-center items-center bg-white dark:bg-slate-950 md:p-4 p-2">
									<ShareRoundedIcon
										fontSize="large"
										className="-translate-x-[5%] text-2xl md:text-3xl"
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
						<div className="flex gap-5 flex-wrap">
							<ContentCopyIcon
								className="cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(shareUrl);
									toast("Link Copied to Clipboard");
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
