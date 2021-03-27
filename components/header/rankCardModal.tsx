import { Modal, Zoom } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { RankCard } from "../shared/rankCard";

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
`;

const RankCardBody = styled.div`
	width: 100%;
	max-width: 580px;
	height: 675px;
	position: absolute;
	margin: auto;
	border-radius: 0.25rem;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: var(--background-light-gray);
`;

const RankCardModal = ({ open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<Zoom in={open}>
				<RankCardBody>
					<RankCard />
				</RankCardBody>
			</Zoom>
		</Modal>
	);
};

export default RankCardModal;
