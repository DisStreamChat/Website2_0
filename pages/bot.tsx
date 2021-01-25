import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Main, Hero } from "../components/shared/styles";
import { H1 } from "../components/shared/styles/headings";
import Anchor from "../components/shared/ui-components/Anchor";
import { OrangeButton } from "../components/shared/ui-components/Button";

const BotHero = styled(Hero)`
	text-align: left;
	flex-direction: row;
	box-sizing: border-box;
	min-height: calc(100vh - 80px);
	width: 100%;
	display: flex;
	padding: 1rem 8rem;
	justify-content: space-around;
	@media screen and (max-width: 1024px) {
		padding: 1rem 3rem;
		flex-direction: column-reverse;
		align-items: center;
		.description {
			margin-top: 1rem;
			text-align: center;
			max-width: 90%;
			width: 90%;
		}
		.buttons {
			/* flex-direction: column; */
			align-items: center;
			justify-content: center;
		}
	}
	@media screen and (min-width: 1025px) {
		& > * {
			max-width: 55%;
		}
	}
	@media screen and (max-width: 800px){
		.text p{
			font-size: 1rem;
		}
	}
	p {
		line-height: 170%;
		font-weight: 500;
		color: #aaa;
		font-size: 1.125rem;
	}
	@keyframes hover {
		from {
			transform: translateY(-25px);
		}
		to {
			transform: translateY(25px);
		}
	}
	.hover {
		animation: hover infinite ease-in-out 1s alternate;
	}
	.image {
		position: relative;
		img {
			max-width: 100%;
			height: auto;
		}
		max-width: 45%;
		@media screen and (max-width: 1024px) {
			margin-top: 1rem;
			max-width: 80%;
		}
		&:before {
			opacity: 0;
			position: absolute;
			width: 100%;
			height: 130%;
			transform: scale(1.5) translateY(8%);
			content: "";

			filter: grayscale(1);
			background-image: url("https://i.ibb.co/YhsScDB/blob.png");
			background-size: 100%;
			background-repeat: no-repeat;
		}
	}
	button {
		/* margin-top: 1rem; */
		font-size: 1.15rem;
		font-weight: bold;
	}
	.hero-buttons {
		display: flex;
		flex-wrap: wrap;
		margin-top: 1rem;
		gap: 1.5rem;
	}
`;

const Bot = () => {
	return (
		<>
			<Head>
				<title>DisStreamChat | Discord Bot</title>

				<meta
					data-n-head="ssr"
					data-hid="og:image"
					property="og:image"
					content="https://media.discordapp.net/attachments/710157323456348210/710185505391902810/discotwitch_.png?width=677&height=677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:type"
					property="og:image:type"
					content="image/png"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:width"
					property="og:image:width"
					content="677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:height"
					property="og:image:height"
					content="677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:alt"
					property="og:image:alt"
					content="DisStreamChat's logo"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:description"
					property="og:description"
					content="An incredibly easy to use and feature filled Discord bot to help you make your server the best it can be."
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:title"
					property="og:title"
					content="DisStreamBot"
				/>
			</Head>
			<Main>
				<BotHero>
					<div className="description">
						<div className="text">
							<H1>The best utility bot for Discord</H1>
							<p>
								Manage your server and keep members engaged with an auto moderator,
								a high quality leveling system, Versatile custom commands, a robust
								role management system, and much more!
							</p>
						</div>
						<div className="buttons hero-buttons">
							<Link href="/dashboard/discord">
								<a className="main-button dashboard-button">
									<OrangeButton>Get Started</OrangeButton>
								</a>
							</Link>
							<Anchor
								newTab
								href="https://invite.disstreamchat.com"
								className="main-button dashboard-button"
							>
								<OrangeButton>Add to Discord</OrangeButton>
							</Anchor>
						</div>
					</div>
					<div className="image">
						<img className="hover" src="/bot-hero.gif" alt="" />
					</div>
				</BotHero>
			</Main>
		</>
	);
};

export default Bot;
