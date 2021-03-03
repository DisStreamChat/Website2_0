import styled from "styled-components";
import { Avatar, createStyles, makeStyles, Theme, useMediaQuery, withStyles } from "@material-ui/core";
import { H1, H2 } from "../../shared/styles/headings";
import { motion } from "framer-motion";

export const ServerSelectBody = styled.div`
	/* margin: 0.5rem 0; */
	margin-bottom: 2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

export const ServerTitle = styled(H2)`
	margin-top: 0;
	margin-bottom: 0.5rem;
	text-transform: uppercase;
`;

export const Title = styled(H2)`
	margin: 0.5rem 0;
`;

export const ServerItemBody = styled.div`
	flex: 1 1 49%;
	align-items: center;
	background: #17181b;
	padding: 1rem;
	border-radius: 0.25rem;
	display: flex;
	@media screen and (max-width: 425px) {
		font-size: 0.75rem;
	}
	& > * + * {
		margin-left: 0.5rem;
	}
`;

export const PluginBody = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
	gap: 25px;
	-webkit-box-pack: center;
	justify-content: center;
`;

export const ServerHeader = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	justify-content: space-between;
	h1 {
		font-size: 1.75rem;
		font-weight: bold;
	}
	border-bottom: 1px solid grey;
`;

export const ServerHeaderItem = styled.div`
	display: flex;
	align-items: center;
	--gap: 1rem;
	button {
		white-space: nowrap;
	}
	@media screen and (max-width: 725px) {
		&.buttons {
			flex-direction: column;
		}
		h1 {
			font-size: 1rem;
		}
		button {
			font-size: 80%;
		}
	}
	& > * + * {
		margin-left: var(--gap);
	}
	@supports (gap: 10px) {
		& > * + * {
			margin-left: 0;
		}
		gap: var(--gap);
	}
`;

export const LargeAvatar = withStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 80,
			height: 80,
		},
	})
)(Avatar);

export const ServerModal = styled.div`
	width: 50vw;
	height: 80vh;
	background: var(--background-light-gray);
	border-radius: 0.25rem;
	padding: 1.5rem;
	position: relative;
`;

export const InfoModal = styled(ServerModal)`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const SettingsModal = styled(ServerModal)`
	& > * + * {
		margin-top: 1.5rem;
	}
	& > * {
		border-bottom: 1px solid #66666690;
		padding-bottom: 0.75rem;
	}
`;

export const ModalTitle = styled(H1)`
	font-size: 1.5rem;
	text-transform: uppercase;
`;

export const ModalSubTitle = styled(H2)`
	font-size: 1rem;
	text-transform: uppercase;
	color: #ffffffa0;
	margin: 0;
`;

export const ModalInfo = styled.div`
	color: #ffffffa0;
	margin-bottom: 0.25rem;
`;

export const SaveSection = styled(motion.div)`
	position: absolute;
	width: 90%;
	left: 50%;
	bottom: 20px;
	height: 50px;
	border-radius: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--background-dark-gray);
	padding: 0.5rem 1rem;
	box-sizing: content-box;
	border: none;
	div:last-child > * + * {
		margin-left: 0.5rem;
	}
`;
