import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { H2 } from "../shared/styles/headings";
import chroma from "chroma-js";
import React, { useState } from "react";

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
const NavItem = styled(motion.div)`
	background: none;
	outline: none;
	border: none;
	color: white;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	a {
		padding: 0.5rem 1rem;
		&:focus {
			color: white;
		}
	}
	.underline {
		position: absolute;
		border: 1px solid white;
		/* left: 0;
		right: 0; */
		bottom: 10%;
		width: 80%;
		transform-origin: center;
	}
	&:not(.no-focus) {
		&:focus {
			outline: 1px solid;
		}
	}
`;

const navItem = ({ children, ...props }) => {
	const [focused, setFocused] = useState(false);
	const [hovered, setHovered] = useState(false);

	const underlined = focused || hovered;

	return (
		<NavItem
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			className="no-focus"
			{...props}
		>
			{children}
			<AnimatePresence>
				{underlined && (
					<motion.div
						initial={{ scaleX: 0 }}
						exit={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{
							ease: "easeInOut",
							duration: 0.25,
						}}
						key="underline"
						className="underline"
					></motion.div>
				)}
			</AnimatePresence>
		</NavItem>
	);
};

const logo = styled.div`
	&:focus-within {
		outline: 1px solid;
	}
`;

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
	a,
	button {
		width: 100%;
	}
	button {
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

const UserProfile = styled.button`
	background: none;
	color: white;
	border: none;
	text-align: left;
	display: flex;
	align-items: center;
	position: relative;
	&:focus {
		outline: 1px solid;
	}
	a {
		padding: 0 !important;
	}
	&,
	& * {
		cursor: pointer;
	}
	& > * + * {
		margin-left: 0.5rem;
	}
`;

const Username = styled.span`
	display: inline-block;
`;

const Chevron = styled(motion.div)`
	transform-origin: center;
	height: 24px;
	width: 24px;
`;

const menuDropDown = styled(motion.div)`
	border-radius: 0.25rem;
	position: absolute;
	top: 100%;
	right: 0;
	padding: 0.5rem;
	width: 200px;
	z-index: 10000;
	background: #121212;
`;

const menuItem = styled(motion.button)`
	background: none;
	border: none;
	outline: none;
	text-align: left;
	border-radius: 0.25rem;
	width: 100%;
	a {
		padding: 0;
	}
	color: ${({ warn }: { warn?: boolean }): any =>
		warn ? chroma("#bb3535").brighten().saturate(2) : "white"};
	padding: 0.5rem;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	z-index: 100;
	gap: 0.5rem;
	&:hover::before,
	&:focus::before,
	&:focus-within::before {
		opacity: 1;
	}
	&::before {
		border-radius: 0.25rem;

		transition: opacity 0.25s;
		z-index: -1;
		position: absolute;
		content: "";
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		background: rgba(226, 226, 226, 0.055);
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
	Username,
	Chevron,
	UserProfile,
	menuDropDown,
	menuItem,
	NavItem,
};
