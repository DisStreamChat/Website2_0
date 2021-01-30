import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Main, Hero } from "../components/shared/styles";
import { H1, H2 } from "../components/shared/styles/headings";
import Anchor from "../components/shared/ui-components/Anchor";
import { OrangeButton } from "../components/shared/ui-components/Button";

const Subheading = styled(H2)`
	font-style: normal;
	font-weight: 400;
	font-size: 2rem;
	line-height: 170%;
	margin-top: 1rem;
	margin-bottom: 0;
	text-align: center;
	color: #aaa;
	@media screen and (max-width: 425px) {
		font-size: 1.5rem;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 1rem;
	max-width: 700px;
	button {
		margin: 0.5rem 2rem;
		font-weight: bold;
		font-size: 1.15rem;
		@media screen and (max-width: 425px) {
			font-size: 1rem;
		}
	}
`;

const BG = styled.img`
	position: absolute;
	width: 100%;
	opacity: .5;
	pointer-events: none;
`

export default function Home() {
	return (
		<Main>
			<Hero>
				<BG src="/bg-1.svg" alt=""/>
				<H1>Integrate your Discord server with Twitch</H1>
				<Subheading>
					Chat, moderation, interactivity, and much more easily Integrated with Twitch and
					Discord!
				</Subheading>
				<Buttons>
					<a tabIndex={-1} href="#features">
						<OrangeButton>See Features</OrangeButton>
					</a>
					<Anchor tabIndex={-1} href="https://invite.disstreamchat.com" newTab>
						<OrangeButton>Add to Discord</OrangeButton>
					</Anchor>{" "}
					<Link href="/dashboard">
						<a tabIndex={-1}>
							<OrangeButton>My Dashboard</OrangeButton>
						</a>
					</Link>
				</Buttons>
			</Hero>
			<div id="features"></div>
		</Main>
	);
}
