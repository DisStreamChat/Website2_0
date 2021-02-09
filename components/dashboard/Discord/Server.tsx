import React, { useEffect, useState } from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import styled from "styled-components";
import { useRouter } from "next/router";
import Plugins from "./Plugins";
import { getServerIconUrl } from "../../../utils/functions";
import { Avatar, createStyles, makeStyles, Theme, withStyles } from "@material-ui/core";
import { NoIcon } from "../../shared/styles/guildIcon";
import { BlueButton } from "../../shared/ui-components/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { useQuery } from "react-query";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Zoom from "@material-ui/core/Zoom";
import { H1, H2 } from "../../shared/styles/headings";
import Select from "./Select";
import { TextInput } from "../../shared/ui-components/TextField";
import { useDiscordContext } from "./discordContext";
import RoleItem, { RoleOption } from "./RoleItem";
import { transformObjectToSelectValue, parseSelectValue } from "../../../utils/functions";

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
	margin-bottom: 0.5rem;
	padding-bottom: 0.5rem;
	justify-content: space-between;
	h1 {
		font-size: 1.75rem;
		font-weight: bold;
	}
	border-bottom: 1px solid grey;
`;

const ServerHeaderItem = styled.div`
	display: flex;
	align-items: center;
	--gap: 1rem;
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

const LargeAvatar = withStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 80,
			height: 80,
		},
	})
)(Avatar);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: "2px solid #000",
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	})
);

const ServerModal = styled.div`
	width: 50vw;
	height: 80vh;
	background: var(--background-light-gray);
	border-radius: 0.25rem;
	padding: 1.5rem;
`;

const InfoModal = styled(ServerModal)`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const SettingsModal = styled(ServerModal)`
	& > * + * {
		margin-top: 1.5rem;
	}
	& > * {
		border-bottom: 1px solid #66666690;
		padding-bottom: 0.75rem;
	}
`;

const ModalTitle = styled(H1)`
	font-size: 1.5rem;
	text-transform: uppercase;
`;

const ModalSubTitle = styled(H2)`
	font-size: 1rem;
	text-transform: uppercase;
	color: #ffffffa0;
	margin: 0;
`;

const ModalInfo = styled.div`
	color: #ffffffa0;
	margin-bottom: 0.25rem;
`;

const ServerModals = ({
	infoModalOpen,
	setInfoModalOpen,
	settingsModalOpen,
	setSettingsModalOpen,
	serverId,
}) => {
	const classes = useStyles();
	const [adminRoles, setAdminRoles] = useState([]);
	const [localPrefix, setLocalPrefix] = useState("");
	const [localNickname, setLocalNickname] = useState("");

	const {
		roles,
		adminRoles: defaultAdminRoles,
		serverSettings: { prefix, nickname, adminRoles: dbAdminRoles },
	} = useDiscordContext();

	useEffect(() => {
		setLocalNickname(nickname);
		setLocalPrefix(prefix);
		setAdminRoles(dbAdminRoles);
	}, [nickname, prefix, dbAdminRoles]);

	const { data } = useQuery("server-data", () =>
		fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
		).then(res => res.json())
	);

	const mappedRoles = adminRoles.map(role => ({
		value: transformObjectToSelectValue(role),
		label: (
			<RoleItem
				onClick={id => setAdminRoles(prev => prev.filter(role => role.id !== id))}
				{...role}
			></RoleItem>
		),
	}));

	const mappedDefaultRoles = defaultAdminRoles.map(
		(role: { color: string; name: string; id: string }) => ({
			value: transformObjectToSelectValue(role),
			label: <RoleItem disabled {...role} />,
		})
	);

	return (
		<>
			<Modal
				aria-labelledby="settings-modal"
				aria-describedby="settings-modal"
				open={settingsModalOpen}
				onClose={() => setSettingsModalOpen(false)}
				BackdropComponent={Backdrop}
				className={classes.modal}
			>
				<Zoom in={settingsModalOpen}>
					<SettingsModal>
						<div>
							<ModalTitle>Bot Nickname</ModalTitle>
							<TextInput
								placeholder="DisStreamBot"
								value={localNickname}
								onChange={e => setLocalNickname(e.target.value)}
							/>
						</div>
						<div>
							<ModalTitle>Command Prefix</ModalTitle>
							<TextInput
								value={localPrefix}
								onChange={e => setLocalPrefix(e.target.value)}
							/>
						</div>
						<div>
							<ModalTitle>Bot Admins</ModalTitle>
							<ModalSubTitle>Default Admins</ModalSubTitle>
							<ModalInfo>
								These are the roles that have permission to manage your server.
							</ModalInfo>
							{roles && (
								<Select
									onChange={value => {
										const parsedValue = parseSelectValue(value);
										setAdminRoles(prev => [
											...prev,
											roles.find(role => role.id === parsedValue),
										]);
									}}
									value={[...mappedDefaultRoles, ...mappedRoles]}
									options={roles.map(role => ({
										value: transformObjectToSelectValue(role),
										label: <RoleOption {...role}>{role.name}</RoleOption>,
									}))}
								/>
							)}
						</div>
					</SettingsModal>
				</Zoom>
			</Modal>
			<Modal
				aria-labelledby="settings-modal"
				aria-describedby="settings-modal"
				open={infoModalOpen}
				onClose={() => setInfoModalOpen(false)}
				BackdropComponent={Backdrop}
				className={classes.modal}
			>
				<Zoom in={infoModalOpen}>
					<InfoModal>
						{!data && (
							<>
								<div>
									<ModalSubTitle>Region</ModalSubTitle>
									<ModalInfo>{data?.region}</ModalInfo>
								</div>
								<div>
									<ModalSubTitle>Channels</ModalSubTitle>
									<ModalInfo>{data?.channels?.length}</ModalInfo>
								</div>
								<div>
									<ModalSubTitle>Roles</ModalSubTitle>
									<ModalInfo>{data?.roles?.length}</ModalInfo>
								</div>
								<div>
									<ModalSubTitle>Members</ModalSubTitle>
									<ModalInfo>{data?.members?.length}</ModalInfo>
								</div>
								<div>
									<ModalSubTitle>Custom Emojis</ModalSubTitle>
									<ModalInfo>{data?.emojis?.length}</ModalInfo>
								</div>
							</>
						)}
					</InfoModal>
				</Zoom>
			</Modal>
		</>
	);
};

const Server = ({ server }) => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	const iconImage = getServerIconUrl(server.icon, server.id);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [localActivePlugins, setLocalActivePlugins] = useState({});

	const { activePlugins } = useDiscordContext();

	useEffect(() => {
		setLocalActivePlugins(activePlugins);
	}, []);

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
					<h1>{server.name}</h1>
				</ServerHeaderItem>
				<ServerHeaderItem>
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
				<Plugins />
			)}
		</>
	);
};

export default Server;
