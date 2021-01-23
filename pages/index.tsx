import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Main, Hero } from "../components/shared/styles";
import { H1, H3 } from "../components/shared/styles/headings";
import Anchor from "../components/shared/ui-components/Anchor";
import { OrangeButton } from "../components/shared/ui-components/Button";

const Subheading = styled(H3)`
	font-style: normal;
	font-weight: 400;
	font-size: 2rem;
	line-height: 170%;
	margin-top: 1rem;
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

export default function Home() {
	return (
		<Main>
			<Hero>
				<H1>Integrate your Discord server with Twitch</H1>
				<Subheading>
					Chat, moderation, interactivity, and much more easily Integrated with Twitch and
					Discord!
				</Subheading>
				<Buttons>
					<OrangeButton>
						<a href="#features">See Features</a>
					</OrangeButton>
					<OrangeButton>
						<Anchor href="https://invite.disstreamchat.com" newTab>
							Add to Discord
						</Anchor>{" "}
					</OrangeButton>
					<OrangeButton>
						<Link href="/dashboard">
							<a>My Dashboard</a>
						</Link>
					</OrangeButton>
				</Buttons>
			</Hero>
		</Main>
	);
}
