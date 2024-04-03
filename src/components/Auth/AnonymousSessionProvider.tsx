import { useEffect, ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import { getUserConfirmation } from "@/utils/Auth/getUserConfirmation";

export default function AnonymousSessionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			// login as anonymous
			signIn("credentials").then((data) => {
				// async sign-in returned
			});
		}
		if (status === "authenticated") {
			// check for logged in user
			const a = getUserConfirmation({
				email: session?.user?.email as string,
			}).then((data) => {
				if (data.userExists) {
					
					// user exists
					console.log("user exists");
					localStorage.setItem("userId", data.userId as string);

				} else {
					// user does not exist
					console.log("user does not exist");
					signIn("credentials").then((data) => {
						// async sign-in returned
					});
				}
			});
		}
	}, [status]);

	return <>{children}</>;
}
