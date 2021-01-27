import styled from "styled-components";
import { Main } from "../../components/shared/styles";
import { motion } from "framer-motion";

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
	@media screen and (max-width: 1024px) {
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
	}
	position: relative;
	/* overflow: hidden; */
	@media screen and (max-width: 1024px) {
		text-align: center;
	}
`;

export const ContentArea = styled.div`
	margin: 0 0 0 2rem;
	min-width: 60%;
	outline: solid;
	@media screen and (max-width: 1024px) {
		margin: 2rem 0 0 0;

		min-width: 80%;
	}
	@media screen and (max-width: 320px) {
		min-width: 90%;
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