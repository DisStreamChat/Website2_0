import React, { useState } from "react";
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
`;

const ServerModals = ({
	infoModalOpen,
	setInfoModalOpen,
	settingsModalOpen,
	setSettingsModalOpen,
	serverId,
}) => {
	const { data } = useQuery("server-data", () =>
		fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
		).then(res => res.json())
	);

	const classes = useStyles();

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
					<ServerModal>
						<ModalTitle>Bot Admins</ModalTitle>
						<ModalSubTitle>Default Admins</ModalSubTitle>
						<ModalInfo>
							These are the roles that have permission to manage your server.
						</ModalInfo>
						<Select
							onChange={() => {}}
							value={[{ value: "david", label: "david" }, { value: "david", label: "david" }]}
							options={[{ value: "david", label: "david" }]}
						/>
					</ServerModal>
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
					<ServerModal></ServerModal>
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
