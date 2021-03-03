import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { GreenButton, RedButton } from "../../shared/ui-components/Button";
import { useQuery } from "react-query";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Zoom from "@material-ui/core/Zoom";
import Select from "./Select";
import { TextInput } from "../../shared/ui-components/TextField";
import { useDiscordContext } from "./discordContext";
import RoleItem, { RoleOption } from "./RoleItem";
import { transformObjectToSelectValue, parseSelectValue } from "../../../utils/functions";
import { isEqual } from "lodash";
import firebaseClient from "../../../firebase/client";
import { AnimatePresence } from "framer-motion";
import { InfoModal, ModalInfo, ModalSubTitle, ModalTitle, SaveSection, SettingsModal } from "./styles";

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

export default ServerModals;
