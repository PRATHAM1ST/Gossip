export function checkAdmin({
	email,
	token_provider,
}: {
	email: string;
	token_provider: string;
}) {

	const listOfAdmins = ["chudasamapratham142@gmail.com"];
	if (listOfAdmins.includes(email) && token_provider === "github") {
		return {
			success: true,
			message: "User is admin",
		};
	}
	return {
		success: false,
		message: "User is not admin",
	};
}
