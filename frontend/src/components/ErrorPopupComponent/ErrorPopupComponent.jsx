import { useEffect } from "react";
import style from "./ErrorPopupComponent.module.css";

const ErrorPopup = ({ message, onClose, duration = 4000 }) => {
	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				onClose?.();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div className={style.errorPopup}>
			{message}
			{onClose && (
				<button className={style.errorPopupClose} onClick={onClose}>
					×
				</button>
			)}
		</div>
	);
};

export default ErrorPopup;
