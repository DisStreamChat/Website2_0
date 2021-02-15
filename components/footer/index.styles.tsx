import styled from "styled-components";
import { H4 } from "../shared/styles/headings";

const footer = styled.footer`
	display: flex;
	flex-direction: column;
	background: var(--background-dark-gray);
	color: white;
	margin-top: 3rem;
	a:hover,
	a:focus {
		text-underline-position: under;
		text-decoration: underline;
	}
	a[aria-label]:focus,
	a[aria-label]:hover {
		outline: 1px solid !important;
		opacity: 1;
		color: white;
	}
`;

const top = styled.div`
	padding: 3rem 1.5rem;
	display: flex;
	justify-content: space-between;
	@media screen and (max-width: 1250px) {
		flex-direction: column;
	}
`;

const right = styled.div`
	display: flex;
	a {
		opacity: 0.9;
		margin: 3px 0;
	}
	@media screen and (max-width: 1250px) {
		margin-top: 2rem;
		justify-content: space-between;
		width: 90%;
		flex-wrap: wrap;
	}
`;

const left = styled.div``;

const bottom = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 0.75rem;
	padding: 0.5rem;
	a {
		&:hover {
			text-decoration: underline;
		}
	}
`;

const icons = styled.div`
	margin-top: 0.125rem;
	& > * + * {
		margin-left: 0.75rem;
	}
`;

const column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3rem;
	&:last-child {
		margin-right: 0;
	}
	@media screen and (max-width: 800px) {
		margin-top: 2rem;
	}
`;

const h4 = styled(H4)`
	font-weight: 400;
	opacity: 0.9;
`;

const heading = styled.span`
	font-weight: 700;
	margin-bottom: 1rem;
`;

export default {
	footer,
	top,
	bottom,
	heading,
	left,
	right,
	icons,
	column,
	h4,
};
