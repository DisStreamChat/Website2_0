import { GetServerSideProps } from "next";
import admin from "../../firebase/admin";
import firebaseClient from "../../firebase/client";
import styled from "styled-components";
import { NoIcon } from "../../components/shared/styles/guildIcon";
import React, { useEffect, useState } from "react";
import { H1 } from "../../components/shared/styles/headings";
import { gapFunction } from "../../components/shared/styles";
import { Avatar } from "@material-ui/core";
import { LargeAvatar, MediumAvatar } from "../../components/dashboard/Discord/styles";
import { formatNumber } from "../../utils/functions/stringManipulation";
import { getXp, map } from "../../utils/functions";
import { motion } from "framer-motion";

const LeaderboardHeader = styled.div`
	img {
		border-radius: 50%;
	}
	h1 {
		margin-left: 1rem;
	}
	display: flex;
	padding: 3rem 0;
	align-items: center;
	margin-bottom: 3rem;
`;
const LeaderboardBody = styled.div`
	display: flex;
	@media screen and (max-width: 350px){
		width: 100vw;
	}
`;

const LeaderBoardMain = styled.main`
	width: 100%;
	max-width: 1440px;
	margin: 0 auto;
	padding: 0 1rem;
	display: flex;
	flex-direction: column;
	min-height: calc(100vh - 80px);
	@media screen and (max-width: 350px){
		padding-left: 0px;
	}
`;

const UserList = styled.ul`
	width: 80%;
	padding: 1.25rem !important;
	box-sizing: content-box;
	background: #3e4246;
	box-shadow: 0 0 16px -6px #4e4b4b;
	@media screen and (max-width: 712px){
		width: 95%;
	}
	
`;

interface userProps {
	level: number;
	xp: number;
	name: string;
	avatar: string;
	place: number;
	id: string;
}

const ListItem = styled.li`
	&,
	& > div {
		display: flex;
		align-items: center;
	}
	justify-content: space-between;
	background: #3e4246;
	border-bottom: 0.25px solid #474b50;
	& > div:first-child {
		padding: 1rem 0 !important;
		${gapFunction({ gap: "1rem" })};
		white-space: nowrap;
		@media screen and (max-width: 660px){
			font-size: .75rem;
		}
	}
	.xp {
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	.progress-ring {
		transform: rotate(-90deg);
	}
	.level-data {
		position: relative;
	}
	.level {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	@media screen and (max-width: 500px){
		flex-direction: column;
		align-items: flex-start;
	}
`;

const RankItem = styled.div`
	flex: 0 0 35px;
	background-color: #50555a;
	height: 35px;
	border-radius: 50%;
	display: box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	font-family: "Poppins";
	color: #fff;
	&.place-1 {
		background: #da9e3b;
	}
	&.place-2 {
		background: #989898;
	}
	&.place-3 {
		background: #ae7441;
	}
`;

const Experience = styled.span`
	font-size: 12px;
	color: #85878a;
	text-transform: uppercase;
`;

const radius = 36;
const circ = 2 * Math.PI * radius;

const UserItem = (props: userProps) => {
	const [userDetails, setUserDetails] = useState({
		name: props.name,
		avatar: props.avatar,
		id: props.id,
	});

	useEffect(() => {
		(async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveuser?user=${props.id}`
			);
			const json = await response.json();
			setUserDetails({
				name: json?.username,
				avatar: json?.avatarURL,
				id: props.id,
			});
		})();
	}, []);

	const [progression, setProgression] = useState(0);

	const { level, xp } = props;

	useEffect(() => {
		const xpThisLevel = getXp(level);
		const xpToNextLevel = getXp(level + 1);
		const bigDif = Math.abs(xpThisLevel - xpToNextLevel);
		const dif = Math.abs(xpToNextLevel - xp);
		setProgression(map(dif, 0, bigDif, 0, circ));
	}, [level, xp]);

	return (
		<ListItem>
			<div>
				<RankItem className={`place-${props.place + 1}`}>{props.place + 1}</RankItem>
				<MediumAvatar src={userDetails.avatar}>
					<img width="50" height="50" src="/default_avatar.png"></img>
				</MediumAvatar>
				{userDetails.name}
			</div>
			<div>
				<div className="xp">
					<Experience>Experience</Experience>
					{formatNumber(props.xp)}
				</div>
				<div className="level-data">
					<motion.svg className="progress-ring" width="120" height="120">
						<motion.circle
							// strokeDashoffset={progression}
							strokeDasharray={`${circ} ${circ}`}
							initial={{
								// strokeDasharray: "0 0",
								strokeDashoffset: circ
							}}
							animate={{
								// strokeDasharray: `${circ} ${circ}`,
								strokeDashoffset: progression,
							}}
							className="progress-ring__circle"
							stroke="#347aa5"
							strokeWidth="4"
							fill="transparent"
							r={radius}
							cx="60"
							cy="60"
						/>
					</motion.svg>
					<span className="level data xp">
						<Experience>Level</Experience>
						{props.level + 1}
					</span>
				</div>
			</div>
		</ListItem>
	);
};

interface Server {
	icon: string;
	nameAcronym: string;
	name: string;
}

interface props {
	users: any[];
	server: Server;
}

const Leaderboard = ({ users, server }: props) => {
	return (
		<LeaderBoardMain>
			<LeaderboardHeader>
				{server.icon ? (
					<img width="100" height="100" src={server.icon}></img>
				) : (
					<NoIcon size={100} name={server.nameAcronym}>
						{server.nameAcronym}
					</NoIcon>
				)}{" "}
				<H1>{server.name}</H1>
			</LeaderboardHeader>
			<LeaderboardBody>
				<UserList>
					{users.map((user, i) => (
						<UserItem key={user.id} place={i} {...user}></UserItem>
					))}
				</UserList>
			</LeaderboardBody>
		</LeaderBoardMain>
	);
};

const levelingIsEnabled = async serverId => {
	const settingsRef = admin.firestore().collection("DiscordSettings").doc(serverId);
	const settings = (await settingsRef.get()).data();
	const activePlugins = settings?.activePlugins;
	const levelingEnabled = activePlugins?.leveling;

	if (!settings || !levelingEnabled) {
		return false;
	}
	return true;
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { req, res, params } = context;

	const serverId = params.serverId as string;
	const levelingRef = admin
		.firestore()
		.collection("Leveling")
		.doc(serverId)
		.collection("users")
		.orderBy("xp", "desc")
		.limit(100);
	const leveling = (await levelingRef.get()).docs?.map(doc => ({ id: doc.id, ...doc.data() }));

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
	);
	const json = await response.json();

	const server = {
		icon: json?.iconURL || "",
		nameAcronym: json?.nameAcronym || "",
		name: json?.name || "",
	};

	if (!(await levelingIsEnabled(serverId)) || leveling?.length === 0) {
		return { notFound: true };
	}

	return {
		props: {
			users: leveling,
			server,
		},
	};
};

export default Leaderboard;
