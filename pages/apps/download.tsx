import { gapFunction, Main } from "../../components/shared/styles";
import Feature from "../../components/shared/ui-components/Feature";
import styled from "styled-components";
import React, { useMemo } from "react";
import { Features } from "..";
import { BlueButton } from "../../components/shared/ui-components/Button";
import { getOS } from "../../utils/functions";
import Anchor from "../../components/shared/ui-components/Anchor";

const DownloadMain = styled(Main)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	min-height: calc(100vh - 125px);
`;

const DownloadItem = styled.div`
	box-sizing: border-box !important;
	min-height: calc(25vh - var(--header-height) * 0.25);
	align-items: center;
	margin: 1rem;
	/* max-width: 450px; */
	padding: 0 1rem 1rem;
	background: #0b0c0e;
	box-shadow: 10px 10px 14px -4px #000;
	border-radius: 0.5rem;
	min-width: 190px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-align: center;
	h1 {
		margin: 0.67rem 0;
		font-size: 2rem;
	}
	img {
		margin-bottom: 1rem;
	}
`;

const getOsDetails = os => {
	switch (os) {
		case "Mac OS":
		case "IOS":
			return {
				name: "Mac",
				link: "https://i.lungers.com/disstreamchat/darwin",
				image: "/apple.png",
			};
		case "Windows":
		case "Android":
			return {
				name: "Windows",
				link: "https://api.disstreamchat.com/app",
				image: "/windows.webp",
			};
		case "Linux":
			return {
				name: "Linux",
				link: "https://i.lungers.com/disstreamchat/linux",
				image: "/linux.png",
			};
	}
};

const Downloads = styled.div`
	display: flex;
	${gapFunction({ gap: "2rem" })}
	img[src="/apple.png"] {
		filter: invert(1);
	}
`;

const Download = () => {
	const os = useMemo(() => {
		if (typeof window !== "undefined") {
			return getOS();
		}
	}, []);

	const osDetails = getOsDetails(os);

	return (
		<DownloadMain>
			<Features>
				<Feature
					title="DisStreamChat Chat Client"
					subtitle="All your stream chats in one place"
					body="Keeping track of your stream can be really difficult, especially if you are streaming cross platform and have large discord community. DisStreamChat allows you have all your chats in one place so you can easily view and moderate the chat."
					images={[
						"https://media.discordapp.net/attachments/737523144184823808/756511008616611931/twit1.jpg",
					]}
				></Feature>
			</Features>
			<Downloads>
				{osDetails ? (
					<DownloadItem>
						<h1>Download for {osDetails.name}</h1>
						<img width="100" src={osDetails.image} alt="" />
						<Anchor newTab href={osDetails.link}>
							<BlueButton>Latest Version</BlueButton>
						</Anchor>
					</DownloadItem>
				) : (
					["Windows", "Linux", "Mac OS"].map(platform => {
						const details = getOsDetails(platform);
						return (
							<DownloadItem>
								<h1>Download for {details.name}</h1>
								<img width="100" src={details.image} alt="" />
								<Anchor newTab href={details.link}>
									<BlueButton>Latest Version</BlueButton>
								</Anchor>
							</DownloadItem>
						);
					})
				)}
			</Downloads>
		</DownloadMain>
	);
};

export default Download;
