import React, { forwardRef } from "react";
import MessageComponent from "../MessageComponent/MessageComponent.jsx";
import useConversation from "../../hooks/useConversation.js";
import style from "./ConversationComponent.module.css";
import { dotPulse } from "ldrs";
dotPulse.register();

function InputField({ value, onChange, onEnter }) {
	return (
		<input
			className={style.inputField}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && value.trim()) onEnter();
			}}
		/>
	);
}

const ConversationComponent = forwardRef((props, ref) => {
	const {
		messages,
		input,
		setInput,
		sendMessageHandler,
		sendCodeHandler,
		endRef,
		isLoading,
		setIsLoading,
	} = useConversation();

	React.useImperativeHandle(ref, () => ({
		handleSendCodeToModel: sendCodeHandler,
	}));

	return (
		<div className={style.conversationPageContainer}>
			<div className={style.conversationArea}>
				<div className={style.textArea}>
					{messages.map((message, idx) => (
						<MessageComponent
							key={idx}
							role={message.role}
							message={message.msg}
						/>
					))}

					{isLoading && (
						<l-dot-pulse
							size="43"
							speed="1.2"
							color="white"
							className={style.loadingSpinner}
						></l-dot-pulse>
					)}
					<div ref={endRef} />
				</div>
				<div className={style.sendMessageArea}>
					<InputField
						value={input}
						onChange={setInput}
						onEnter={sendMessageHandler}
					/>
					<input
						className={style.sendButton}
						type="button"
						value="↑"
						onClick={sendMessageHandler}
						disabled={!input.trim()}
					/>
				</div>
			</div>
		</div>
	);
});

export default ConversationComponent;
