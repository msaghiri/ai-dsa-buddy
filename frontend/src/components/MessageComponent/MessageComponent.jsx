import style from "./MessageComponent.module.css";

function MessageComponent(props) {
	let roleName;

	if (props.role === "user") {
		roleName = "User";
	} else {
		roleName = "Model";
	}

	const roleClass = props.role === "user" ? `${style.user}` : `${style.model}`;
	const classes = `${style.messageContainer} ${roleClass}`;

	return (
		<div className={classes}>
			<div className={style.messageTextContainer}>
				<p className={style.message}>{props.message}</p>
			</div>
		</div>
	);
}

export default MessageComponent;
