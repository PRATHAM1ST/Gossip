import "./globals.css";
import type { Metadata } from "next";
import { inter } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./providers/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner"

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
		<html lang="en" suppressHydrationWarning>
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
							<Toaster />
						</ThemeProvider>
					</>
				</NextAuthProvider>
			</body>
		</html>
	);
}
