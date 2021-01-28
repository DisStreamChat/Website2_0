import styled from "styled-components";
import { Main } from "../../components/shared/styles";
import { motion } from "framer-motion";
import { H1 } from "../shared/styles/headings";

export const DashboardContainer = styled(Main)`
	display: flex;
	justify-content: center;
	min-height: calc(100vh - 80px);
	padding-top: 2rem;
	@media screen and (max-width: 1024px) {
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
	}
`;

export const SideBar = styled.div`
	display: flex;
	flex-direction: column;
	width: 25%;
	max-width: 300px;
	position: sticky;
	top: 80px;
	padding: 0 1rem 1rem 1rem;
	height: fit-content;
	z-index: 10;
	@media screen and (max-width: 1024px) {
		background: var(--background-light-gray);
		padding: 1rem;
		flex-direction: row;
		justify-content: space-around;
		width: 80%;
		max-width: 80%;
	}
`;

export const SideBarItem = styled(motion.div)`
	a {
		align-items: center;
		display: flex;
		height: 50px;
		padding: 0 1rem;
		border-radius: 0.25rem;
		text-transform: capitalize;
		z-index: 10;
		position: relative;
		&:focus {
			outline: 1px solid !important;
		}
	}
	position: relative;
	/* overflow: hidden; */
	@media screen and (max-width: 1024px) {
		text-align: center;
	}
`;

export const ContentArea = styled.div`
	margin: 0 0 0 2rem;
	max-width: 60%;
	min-width: 60%;
	/* max-width: 80%; */
	display: flex;
	flex-direction: column;
	white-space: pre-wrap;
	@media screen and (max-width: 1024px) {
		margin: 2rem 0 0 0;
		min-width: 80%;
	}
	@media screen and (max-width: 425px) {
		${H1} {
			font-size: 1.75rem;
		}
	}
	@media screen and (max-width: 320px) {
		min-width: 90%;
	}
	hr {
		width: 100%;
		border-color: grey;
	}
`;

export const Background = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: var(--disstreamchat-blue);
	border-radius: 0.25rem;
`;

export const SmallTitle = styled.div`
	text-transform: uppercase;
	padding: 0;
	font-size: 12px;
	font-weight: 600;
`;
