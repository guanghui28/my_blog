import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentList, setCommentList] = useState([]);
	const [commentError, setCommentError] = useState(null);

	useEffect(() => {
		const fetchComment = async () => {
			try {
				const res = await fetch(`/api/comment/get-post-comments/${postId}`);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message);
				} else {
					setCommentList(data.comments);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchComment();
	}, [postId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (comment.length > 1000) {
			setCommentError("Comment has maximum 1000 characters");
			return;
		}

		try {
			setCommentError(null);
			const res = await fetch(`/api/comment/add-comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					postId,
					content: comment,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message);
			} else {
				setCommentList([data, ...commentList]);
			}
		} catch (error) {
			setCommentError(error.message);
		} finally {
			setComment("");
		}
	};
	console.log(commentList);
	return (
		<div className="max-w-2xl mx-auto w-full p-3">
			{currentUser ? (
				<div className="flex items-center gap-1 my-5 text-gray-500 text-xs">
					<p>Signed in as:</p>
					<img
						className="h-5 w-5 rounded-full object-cover"
						src={currentUser.profilePicture}
						alt={currentUser.username}
					/>
					<Link
						className="text-xs text-cyan-600 hover:text-cyan-800"
						to={`/dashboard?tab=profile`}
					>
						@{currentUser.username}
					</Link>
				</div>
			) : (
				<div className="text-sm text-teal-500 my-5 flex gap-1">
					You must be signed in to comment.
					<Link className="text-blue-500 hover:underline" to="/sign-in">
						Sign in
					</Link>
				</div>
			)}
			{currentUser && (
				<form
					onSubmit={handleSubmit}
					className="border border-teal-500 rounded-md p-3"
				>
					<Textarea
						placeholder="Add a comment..."
						rows={3}
						maxLength={1000}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<div className="flex justify-between items-center mt-5">
						<p className="text-gray-500 text-xs">
							{1000 - comment.length} characters remaining
						</p>
						<Button outline gradientDuoTone="purpleToBlue" type="submit">
							Submit
						</Button>
					</div>
					{commentError && (
						<Alert color="failure" className="mt-2">
							{commentError}
						</Alert>
					)}
				</form>
			)}
			{commentList?.length > 0 ? (
				<>
					<div className="text-sm my-5 flex items-center gap-1">
						<p>Comments</p>
						<div className="border border-gray-400 py-1 px-2 rounded-sm">
							<p>{commentList.length}</p>
						</div>
					</div>
					{commentList.map((commentItem) => (
						<Comment key={commentItem._id} commentItem={commentItem} />
					))}
				</>
			) : (
				<p className="text-xl my-5">No commnets yet 🥺 .</p>
			)}
		</div>
	);
};

export default CommentSection;
