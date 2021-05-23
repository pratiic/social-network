import React from "react";
import { connect } from "react-redux";

import "./notification.scss";

import { ReactComponent as TickIcon } from "../../assets/icons/tick.svg";
import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

const Notification = ({ text, notification }) => {
	return (
		<div
			className={`notification text-small ${
				notification.showNotification ? "show" : null
			} ${
				notification.successTypeNotification === "true"
					? "success"
					: notification.successTypeNotification === "false"
					? "failure"
					: null
			}`}
		>
			{notification.successTypeNotification === true ? (
				<TickIcon className="icon white" />
			) : notification.successTypeNotification === false ? (
				<ClearIcon className="icon white" />
			) : null}{" "}
			{notification.notificationText}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		notification: state.notification,
	};
};

export default connect(mapStateToProps)(Notification);
