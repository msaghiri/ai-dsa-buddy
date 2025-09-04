import style from "./MessageComponent.module.css";

function MessageComponent(props) {
	let roleName;

	if (props.role === "user") {
		roleName = "User";
	} else {
		roleName = "Model";
	}

	return (
		<div className={style.messageContainer}>
			<h3 className={style.roleTitle}>{roleName}</h3>
			<p className={style.message}>{props.message}</p>
		</div>
	);
}

export default MessageComponent;
