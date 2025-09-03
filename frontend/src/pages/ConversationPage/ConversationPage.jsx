import style from "./ConversationPage.module.css";

function ConversationPage() {
	return (
		<div className={style.conversationPageContainer}>
			<div className={style.conversationArea}>
				<div className={style.textArea}></div>
				<input className={style.inputField} type="text"></input>
			</div>
		</div>
	);
}

export default ConversationPage;
