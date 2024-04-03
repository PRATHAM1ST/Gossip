import "./globals.css";
import type { Metadata } from "next";
import { inter } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./providers/NextAuthProvider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
	title: "Only Gossips",
	description: "A social media platform for gossiping",
	openGraph: {
		images: ["/api/og"],
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<NextAuthProvider>
					<>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</>
				</NextAuthProvider>
			</body>
		</html>
	);
}
