import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Main, Hero } from "../components/shared/styles";
import { H1, H2 } from "../components/shared/styles/headings";
import Anchor from "../components/shared/ui-components/Anchor";
import { OrangeButton } from "../components/shared/ui-components/Button";
import Feature from "../components/shared/ui-components/Feature";
import features from "../utils/landing-features.json";

const Subheading = styled(H2)`
	font-style: normal;
	font-weight: 400;
	font-size: 1.5rem;
	line-height: 170%;
	margin-top: 1rem;
	margin-bottom: 0;
	text-align: center;
	color: #aaa;
	max-width: 45%;
	@media screen and (max-width: 725px) {
		font-size: 1.25rem;
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
		font-size: 2.15rem;
		/* box-shadow: 0 0 35px #f9af15, inset 0 0 20px #f95515; */
		@media screen and (max-width: 425px) {
			font-size: 1rem;
		}
	}
`;

const BG = styled.div`
	height: 600px;
	background-image: url("/bg-1.svg");
	background-size: cover;
	background-position: center;
	position: absolute;
	width: 100%;
	opacity: 0.5;
	top: 15%;
	pointer-events: none;
	@media screen and (max-width: 1000px){
		top: -15px;
	}
	@media screen and (max-height: 580px){
		top: -20%;
	}
`;

const Heading = styled(H1)`
	/* max-width: 50%; */
	--size: 5.625rem;
	font-size: var(--size);
	line-height: var(--size);
	@media screen and (max-width: 725px) {
		--size: 3.25rem;
	}
	text-align: center;
`;

const Features = styled.section`
	width: 65%;
	/* min-height: 2000px; */
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* padding-top: 5rem; */
	z-index: 10;
	@media screen and (max-width: 1250px){
		width: 75%;
	}
`;

export default function Home() {
	return (
		<Main>
			<Hero>
				<BG />
				<Heading>
					DisStream<span dangerouslySetInnerHTML={{ __html: "&#8203" }}></span>Chat
				</Heading>
				<Subheading>
					Chat, moderation, interactivity, and much more easily Integrated with Twitch and
					Discord!
				</Subheading>
				<Buttons>
					{/* <a tabIndex={-1} href="#features">
						<OrangeButton>See Features</OrangeButton>
					</a> */}
					<Anchor tabIndex={-1} href="https://invite.disstreamchat.com" newTab>
						<OrangeButton>Add to Discord</OrangeButton>
					</Anchor>{" "}
					{/* <Link href="/dashboard">
						<a tabIndex={-1}>
							<OrangeButton>My Dashboard</OrangeButton>
						</a>
					</Link> */}
				</Buttons>
			</Hero>
			<Features>
				{features.map((feature, i) => (
					<Feature key={feature.title} {...feature} reversed={i % 2 !== 0} />
				))}
			</Features>
		</Main>
	);
}
