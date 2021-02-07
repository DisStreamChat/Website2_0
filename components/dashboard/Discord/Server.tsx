import React from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import styled from "styled-components";
import { useRouter } from "next/router";
import Plugins from "./Plugins";
import { getServerIconUrl } from "../../../utils/functions";
import { Avatar, createStyles, Theme, withStyles } from "@material-ui/core";
import { NoIcon } from "../../shared/styles/guildIcon";
import { BlueButton } from "../../shared/ui-components/Button";
import SettingsIcon from "@material-ui/icons/Settings";

const PluginBody = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
	gap: 25px;
	-webkit-box-pack: center;
	justify-content: center;
`;

const ServerHeader = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
	justify-content: space-between;
	h1{
		font-size: 1.75rem;
		font-weight: bold;
	}
`;

const ServerHeaderItem = styled.div`
	display: flex;
	align-items: center;
	--gap: 0.5rem;
	& > * + * {
		margin-left: var(--gap);
	}
	@supports (gap: 10px) {
		& > * + * {
			margin-left: 0;
		}
		gap: var(--gap);
	}
`;

const ButtonContainer = styled(ServerHeaderItem)`
	--gap: 1rem !important;
`

const LargeAvatar = withStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 100,
			height: 100,
		},
	})
)(Avatar);

const Server = ({ server }) => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	const iconImage = getServerIconUrl(server.icon, server.id);

	return (
		<>
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
					<h1>{server.name}</h1>
				</ServerHeaderItem>
				<ButtonContainer>
					<BlueButton>Server Info</BlueButton>
					<BlueButton>
						<SettingsIcon /> Settings
					</BlueButton>
				</ButtonContainer>
			</ServerHeader>
			
			{!pluginName ? (
				<PluginBody>
					{plugins.map(plugin => (
						<PluginItem
							key={plugin.id}
							serverId={serverId}
							{...plugin}
							active={false}
						/>
					))}
				</PluginBody>
			) : (
				<Plugins />
			)}
		</>
	);
};

export default Server;
