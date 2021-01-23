import styled from "styled-components";
import { motion } from "framer-motion";
import { H2 } from "../shared/styles/headings";

const Header = styled(motion.header)`
	padding: 0 1rem;
	display: flex;
	align-items: center;
	height: 80px;
	background: var(--background-dark-gray);
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 10000000;
	color: white;
`;

const nav = styled.nav`
	flex: 1;
	height: 100%;
	margin-left: 1rem;
	display: flex;
	align-items: center;
	/* gap: 1rem; */
	& > *:last-child {
		margin-left: auto;
	}
`;

const navItem = styled.div`
	color: white;
	a {
		padding: 0.5rem 1rem;
	}
`;

const logo = styled.div``;

const sidebar = styled(motion.nav)`
	position: fixed;
	top: 80px;
	right: 0;
	height: calc(100vh - 80px);
	width: 100vw;
	background: var(--background-dark-gray);
	z-index: 100;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2rem;
	justify-content: center;
	padding: 2rem;
	button {
		margin-right: 0.5rem;
	}
`;

const loginModal = styled.div`
	form {
		width: 215px;
		padding: 50px;
		box-sizing: content-box;
		justify-content: center;
		flex-direction: column;
		color: #fff;
		background: radial-gradient(var(--disstreamchat-blue), #214d69);
		border-radius: 0.25rem;
		border: none;
		outline: none;
		display: flex;
		align-items: center;
	}
	button {
		width: 100%;
		margin: 0.5rem 0;
	}
`;

const modalHeading = styled.h1`
	font-size: 18px;
	font-weight: 700;
	text-align: center;
	margin: 6px 0;
`;

const modalSubHeading = styled(H2)`
	margin: 6px 0;
	font-size: 14px;
`;

const legal = styled.div`
	display: flex;
	margin-top: 1rem;
	input {
		margin-top: 0.4rem;
		margin-right: 0.5rem;
	}
	a {
		text-decoration: underline;
	}
`;

export default {
	Header,
	nav,
	logo,
	navItem,
	sidebar,
	loginModal,
	modalHeading,
	modalSubHeading,
	legal,
};
