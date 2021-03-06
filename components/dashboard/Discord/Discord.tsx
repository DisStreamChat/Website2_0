import { H1, H2 } from "../../shared/styles/headings";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuth } from "../../../auth/authContext";
import Server from "./Server";
import { dashboardProps } from "../types";
import Plugins from "./Plugins";
import { useEffect, useState } from "react";
import firebaseClient from "../../../firebase/client";
import { redirect_uri } from "../../../utils/constants";
const ServerSelect = dynamic(() => import("./ServerSelect"));
import { useAsyncMemo } from "use-async-memo";
import { ArrayAny } from "../../../utils/functions";

const Description = styled.p`
	font-weight: 400;
	font-size: 1.17rem;
	margin: 0.5rem 0;
	opacity: 0.8;
`;

const ServerArea = styled.div``;

const Discord = ({ session }: dashboardProps) => {
	const [refreshed, setRefreshed] = useState(false);

	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	const user = session.user;

	const databaseServers = useAsyncMemo(
		async () => {
			const collectionRef = firebaseClient.db.collection("DiscordSettings");

			const servers = {};
			const serverIds = user.guilds.map(server => server.id);
			for (const id of serverIds) {
				try {
					const docRef = collectionRef.doc(id);
					const doc = await docRef.get();
					const docData = doc.data();
					servers[id] = docData ?? {};
				} catch (err) {
					console.log(err.message);
				}
			}
			return servers;
		},
		[serverId],
		{}
	);

	const servers = user.guilds.filter(server => {
		const permissionsBased =
			server.permissions.includes("MANAGE_GUILD") ||
			server.owner ||
			server.permissions.includes("ADMINISTRATOR");

		if (permissionsBased) return true;
		const dbserver = databaseServers[server.id];
		console.log(server.roles);
		if (dbserver) {
			// return true
			return ArrayAny(
				server.roles,
				dbserver?.adminRoles?.map(role => (role.id ? role.id : role))
			);
		} else {
			return false;
		}
	});

	const server = servers.find(server => server.id === serverId);

	const refreshToken = user?.refreshToken;
	const userId = user.uid;
	useEffect(() => {
		(async () => {
			if (!refreshToken || !userId) return;
			if (refreshed) return console.log("already refreshed");
			console.log("refreshing", userId);
			const otcData = (await firebaseClient.db.collection("Secret").doc(userId).get()).data();
			const otc = otcData?.value;
			setRefreshed(true);
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_URL
				}/v2/discord/token/refresh?token=${refreshToken}&id=${userId}&otc=${otc}&redirect_url=${encodeURIComponent(
					redirect_uri
				)}`
			);
			if (!response.ok) return;

			const json = await response.json();
			console.log(json);
			if (!json) return;
			console.log(userId);
			await firebaseClient.db
				.collection("Streamers")
				.doc(userId || " ")
				.collection("discord")
				.doc("data")
				.set(json.userData, { merge: true });
		})();
	}, [userId, refreshed, refreshToken]);

	return (
		<>
			{!serverId ? (
				<>
					<H1>Discord Dashboard</H1>
					<Description>
						Connect your discord account to DisStreamChat to get discord messages in
						your client/overlay during stream and manage DisStreamBot in your server.
					</Description>
					<hr />
					<ServerSelect servers={servers} />
				</>
			) : (
				server && <Server server={server} />
			)}
		</>
	);
};

export default Discord;
