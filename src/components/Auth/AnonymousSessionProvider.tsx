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
		localStorage.setItem("userAuthentication", "false");
		if (status === "unauthenticated") {
			localStorage.removeItem("userAuthentication");
			// login as anonymous
			signIn("credentials").then((data) => {
				// async sign-in returned
			});
		}

		if (status === "authenticated" && localStorage.getItem("userAuthentication") === "false"){
			localStorage.setItem("userAuthentication", "true");
			// check for logged in user
			console.log('getUserConfirmation called');
			const a = getUserConfirmation({
				email: session?.user?.email as string,
			}).then((data) => {
				if (data.userExists) {
					
					// user exists
					console.log("user exists");

				} else {
					// user does not exist
					console.log("user does not exist");
					// signIn("credentials").then((data) => {
					// 	// async sign-in returned
					// });
				}
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return <>{children}</>;
}
