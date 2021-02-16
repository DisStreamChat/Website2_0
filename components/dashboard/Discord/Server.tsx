import React, { useEffect, useState } from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import styled from "styled-components";
import { useRouter } from "next/router";
import Plugins from "./Plugins";
import { getServerIconUrl } from "../../../utils/functions";
import { Avatar, createStyles, makeStyles, Theme, withStyles } from "@material-ui/core";
import { NoIcon } from "../../shared/styles/guildIcon";
import { BlueButton, GreenButton, RedButton } from "../../shared/ui-components/Button";
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
import { isEqual } from "lodash";
import firebaseClient from "../../../firebase/client";
import { AnimatePresence, motion } from "framer-motion";
import { Plugins as PluginPage } from "./pluginPages/styles";

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
	padding-bottom: 1rem;
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
	button {
		white-space: nowrap;
	}
	@media screen and (max-width: 725px) {
		&.buttons {
			flex-direction: column;
		}
		h1 {
			font-size: 1rem;
		}
		button {
			font-size: 80%;
		}
	}
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
	position: relative;
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

const SaveSection = styled(motion.div)`
	position: absolute;
	width: 90%;
	left: 50%;
	bottom: 20px;
	height: 50px;
	border-radius: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--background-dark-gray);
	padding: 0.5rem 1rem;
	box-sizing: content-box;
	border: none;
	div:last-child > * + * {
		margin-left: 0.5rem;
	}
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
		setServerSettings,
	} = useDiscordContext();

	const reset = () => {
		setLocalNickname(nickname);
		setLocalPrefix(prefix);
		setAdminRoles(dbAdminRoles);
	};

	const save = () => {
		firebaseClient.updateDoc(`DiscordSettings/${serverId}`, {
			prefix: localPrefix,
			nickname: localNickname,
			adminRoles,
		});
		setServerSettings(prev => ({
			...prev,
			prefix: localPrefix,
			nickname: localNickname,
			adminRoles,
		}));
	};

	useEffect(() => {
		reset();
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

	const changed =
		localNickname !== nickname || localPrefix !== prefix || !isEqual(adminRoles, dbAdminRoles);

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
						<AnimatePresence>
							{changed && (
								<SaveSection
									initial={{ y: 20, x: "-50%", opacity: 0 }}
									exit={{ y: 20, x: "-50%", opacity: 0 }}
									animate={{ y: 0, x: "-50%", opacity: 1 }}
									transition={{ type: "spring" }}
								>
									<div>You have unsaved Changes</div>
									<div>
										<RedButton onClick={reset}>Reset</RedButton>
										<GreenButton onClick={save}>Save</GreenButton>
									</div>
								</SaveSection>
							)}
						</AnimatePresence>
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
						{!!data && (
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
		setLocalActivePlugins(activePlugins || {});
	}, [activePlugins]);

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
		</>
	);
};

export default Server;
