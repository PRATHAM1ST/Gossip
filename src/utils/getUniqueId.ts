const sha1 = require("sha1");

export function getUniqueId({
	userId,
	postId,
}: {
	userId: string;
	postId: string;
}) {
	return sha1(userId + postId) as string;
}
