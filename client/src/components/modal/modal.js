import React from "react";
import { connect, useDispatch } from "react-redux";

import "./modal.scss";

import { hideModal } from "../../redux/modal/modal.actions";

import { ReactComponent as ReloadIcon } from "../../assets/icons/reload.svg";
import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

import Button from "../button/button";

const Modal = ({ show, modalTitle, modalConfirmationHandler }) => {
	const dispatch = useDispatch();

	const closeModal = () => {
		dispatch(hideModal());
	};

	return (
		<div className={`modal-container ${show ? "show" : null}`}>
			<div className="modal">
				<ClearIcon
					className="icon icon-modal-close"
					onClick={closeModal}
				/>
				<p
					className={`modal-title ${
						modalConfirmationHandler
							? "text-medium"
							: "text-small smaller"
					}`}
				>
					{modalTitle}
				</p>
				{modalConfirmationHandler ? (
					<div className="buttons">
						<Button clickHandler={modalConfirmationHandler}>
							sure i am
						</Button>
						<Button red clickHandler={closeModal}>
							not really
						</Button>
					</div>
				) : (
					<ReloadIcon className="icon" />
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		show: state.modal.showModal,
		modalTitle: state.modal.modalTitle,
		modalConfirmationHandler: state.modal.modalConfirmationHandler,
	};
};

export default connect(mapStateToProps)(Modal);
