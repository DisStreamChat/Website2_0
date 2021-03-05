import React, { useEffect, useState } from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import { useRouter } from "next/router";
import Plugins from "./Plugins";
import { getServerIconUrl } from "../../../utils/functions";
import { NoIcon } from "../../shared/styles/guildIcon";
import { BlueButton, GreenButton, RedButton } from "../../shared/ui-components/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { useDiscordContext } from "./discordContext";
import { Plugins as PluginPage } from "./pluginPages/styles";
import { useMediaQuery } from "@material-ui/core";
import ServerModals from "./ServerModals";
import { ServerHeader, ServerHeaderItem, LargeAvatar, PluginBody, SaveSection } from "./styles";
import { isEqual } from "lodash";
import { AnimatePresence } from "framer-motion";
import firebaseClient from "../../../firebase/client";
import SaveBar from "../../shared/ui-components/SaveBar";
import styled from "styled-components";

const ServerName = styled.div`
	h2{
		display: flex;
		align-items: center;
		img{
			margin-right: .75ch;
		}
	}
`;

const Server = ({ server }) => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	const iconImage = getServerIconUrl(server.icon, server.id);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [localActivePlugins, setLocalActivePlugins] = useState({});

	const { activePlugins, setActivePlugins } = useDiscordContext();

	useEffect(() => {
		setLocalActivePlugins(activePlugins || {});
	}, [activePlugins]);

	const verySmall = useMediaQuery("(max-width: 400px)");

	const changed = !isEqual(activePlugins, localActivePlugins);

	const reset = () => setLocalActivePlugins(activePlugins);

	const save = () => {
		firebaseClient.updateDoc(`DiscordSettings/${serverId}`, {
			activePlugins: localActivePlugins,
		});
		setActivePlugins(localActivePlugins);
	};

	const currentPlugin = plugins.find(plugin => plugin.id === pluginName);

	return (
		<>
			<ServerModals
				serverId={serverId}
				infoModalOpen={infoModalOpen}
				setInfoModalOpen={setInfoModalOpen}
				settingsModalOpen={settingsModalOpen}
				setSettingsModalOpen={setSettingsModalOpen}
			/>
			<ServerHeader>
				<ServerHeaderItem>
					<LargeAvatar
						imgProps={{
							width: 100,
						}}
						src={iconImage}
						// alt={`${server.name} icon`}
					>
						<NoIcon
							name={server.name
								.split(" ")
								.map(w => w[0])
								.join("")}
							size={50}
							style={{
								maxWidth: 100,
								minWidth: 100,
								height: 100,
								borderRadius: "50%",
								marginRight: "1rem",
								// backgroundColor: "#36393f",
								color: "white",
								margin: 0,
							}}
						>
							{server.name?.split?.(" ")?.map(w => w[0])}
						</NoIcon>
					</LargeAvatar>
					{!verySmall && (
						<ServerName>
							<h1>{server.name}</h1>
							{currentPlugin && <h2><img width="24" height="24" src={`/${currentPlugin.image}`}/> {currentPlugin.title}</h2>}
						</ServerName>
					)}
				</ServerHeaderItem>
				<ServerHeaderItem className="buttons">
					<BlueButton onClick={() => setInfoModalOpen(true)}>Server Info</BlueButton>
					<BlueButton onClick={() => setSettingsModalOpen(true)}>
						<SettingsIcon /> Settings
					</BlueButton>
				</ServerHeaderItem>
			</ServerHeader>

			{!pluginName ? (
				<PluginBody>
					{plugins.map(plugin => (
						<PluginItem
							{...plugin}
							key={plugin.id}
							serverId={serverId}
							active={!!localActivePlugins[plugin.id]}
							setActive={val =>
								setLocalActivePlugins(prev => ({ ...prev, [plugin.id]: val }))
							}
						/>
					))}
				</PluginBody>
			) : (
				<PluginPage>
					<Plugins />
				</PluginPage>
			)}

			<SaveBar changed={changed} save={save} reset={reset} />
		</>
	);
};

export default Server;
