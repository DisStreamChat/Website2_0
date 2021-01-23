import styled from "styled-components";
import {motion} from "framer-motion"

const Header = styled(motion.header)`
	padding: 0 1rem;
	display: flex;
	align-items: center;
	height: 80px;
	background: var(--background-dark-gray);
	position: fixed;
	top: 0;
	width: 100%;
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
		margin-right: .5rem;
	}
`

export default {
	Header,
	nav,
	logo,
	navItem,
	sidebar
};
