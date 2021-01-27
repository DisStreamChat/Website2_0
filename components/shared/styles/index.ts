import styled from "styled-components";

export const Main = styled.main`
	background: var(--background-light-gray);
`;

export const Hero = styled.section`
	min-height: calc(100vh - 80px - 4rem);
	padding: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	box-sizing: content-box;
	text-align: center;
	color: white;
	flex-direction: column;
`;

export const DiscordMention = styled.span`
	padding: 0.25rem;
	color: #7289da;
	background: rgba(114, 137, 218, 0.1);
	border-radius: 0.25rem;
	font-weight: 500;
	margin-left: 0.5rem;
	transition: 0.1s;
`;
