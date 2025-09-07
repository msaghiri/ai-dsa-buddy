import { useState } from "react";
import { useEffect } from "react";
import style from "./MessageComponent.module.css";

function MessageComponent(props) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(true);
	}, []);

	const roleClass = props.role === "user" ? `${style.user}` : `${style.model}`;
	const classes = `${style.messageContainer} ${roleClass} ${
		visible ? style.visible : ""
	}`;

	return (
		<div className={classes}>
			<div className={style.messageTextContainer}>
				<p className={style.message}>{props.message}</p>
			</div>
		</div>
	);
}

export default MessageComponent;
