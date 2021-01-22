import styled from "styled-components";

const Header = styled.header`
	padding: 0 1rem;
	display: flex;
	align-items: center;
	height: 80px;
	background: var(--background-dark-gray);
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

export default {
	Header,
	nav,
	logo,
	navItem,
};
