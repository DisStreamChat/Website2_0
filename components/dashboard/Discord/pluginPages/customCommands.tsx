import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { H1, H2, H3, H4 } from "../../../shared/styles/headings";
import { BlueButton } from "../../../shared/ui-components/Button";
import { PluginSubHeader } from "./styles";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebaseClient from "../../../../firebase/client";
import ListItem from "../../../shared/ui-components/ListItem";
import { isEqual } from "lodash";
import SaveBar from "../../../shared/ui-components/SaveBar";
import Modal from "../../../shared/ui-components/Modal";
import { command, commandMap } from "../../../../utils/types";
import ClearIcon from "@material-ui/icons/Clear";
// import { TextField, InputAdornment } from "@material-ui/core";
import { discordContext } from "../discordContext";
import { TextArea, TextInput } from "../../../shared/ui-components/TextField";

const CommandsHeader = styled(PluginSubHeader)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	align-items: flex-start;
	& > * + * {
		margin-top: 1rem;
		margin-left: 0;
	}
`;

const CommandModalBody = styled.div`
	width: 100vw;
	height: 100vh;
	background: var(--background-light-gray);
`;

const actions = {
	UPDATE: "update",
	SET: "set",
	CLEAR: "clear",
	RESET: "clear",
};

const defaultCommand = serverId => ({
	DM: false,
	allowedChannels: [],
	bannedRoles: [],
	cooldown: 0,
	cooldownTime: 0,
	deleteUsage: false,
	description: "",
	lastUsed: 0,
	message: "",
	name: "",
	permittedRoles: [serverId],
	role: false,
	type: "text",
});

const commandReducer = (state, action) => {
	switch (action.type) {
		case actions.UPDATE:
			return { ...state, [action.key]: action.value };
		case actions.SET:
			return action.value;
		case actions.CLEAR:
		case actions.RESET:
			return defaultCommand(action.server);
	}
};

const CommandHeader = styled.div`
	box-sizing: border-box !important;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1.5rem;
	width: 100vw;
	height: 70px;
	box-shadow: 0 1px 0 0 hsl(0deg 0% 67% / 20%), 0 1px 2px 0 hsl(0deg 0% 67% / 20%);
	button {
		background: #101010;
		color: #aaa;
		border-radius: 0.25rem;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		outline: none !important;
	}
`;

const SectionTitle = styled.div`
	color: white;
	text-transform: uppercase;
	padding: 0;
	font-size: 12px;
	font-weight: 600;
	margin-bottom: 8px;
`;

const CreateCommandArea = styled.div`
	padding: 2rem;
	hr {
		border-color: #aaaaaaaa;
		margin: 1rem 0;
	}
`;

const CommandModal = ({ defaultValue, ...props }) => {
	const router = useRouter();
	const [, serverId, pluginName] = router.query.type as string[];
	const { serverSettings } = useContext(discordContext);

	const [state, dispatch] = useReducer<(state: any, action: any) => command, command>(
		commandReducer,
		defaultValue ?? defaultCommand(serverId),
		command => command
	);

	useEffect(() => {
		if (defaultValue) {
			dispatch({ type: actions.SET, value: { ...defaultValue } });
		} else {
			dispatch({ type: actions.RESET, server: serverId });
		}
	}, [defaultValue]);

	return (
		<Modal open={props.open} onClose={props.onClose}>
			<CommandModalBody>
				<CommandHeader>
					<H2>Create Text Command</H2>
					<button onClick={props.onClose}>
						<ClearIcon />
					</button>
				</CommandHeader>
				<CreateCommandArea>
					<SectionTitle>Command Name</SectionTitle>
					<TextInput
						prefix={serverSettings.prefix}
						value={state.name}
						onChange={e => {
							console.log(e.target.value);
							dispatch({
								type: actions.UPDATE,
								value: e.target.value
									.replaceAll(" ", "-")
									.slice(serverSettings.prefix.length),
								key: "name",
							});
						}}
					/>
					<hr />
					<SectionTitle>Command Response</SectionTitle>
					<TextArea
						value={state.message}
						onChange={e => {
							dispatch({
								type: actions.UPDATE,
								value: e.target.value,
								key: "message",
							});
						}}
						trigger={{
							"{": {
								dataProvider: token => {
									return ["player", "level"]
										.filter(chatter => chatter.includes(token))
										.map(chatter => ({
											name: `${chatter}`,
											char: `{${chatter}}`,
										}));
								},
								component: ({ selected, entity: { name, char } }) => (
									<div className={`text-area-item ${selected ? "selected" : ""}`}>
										{name}
									</div>
								),
								output: (item, trigger) => item.char,
							},
						}}
					></TextArea>
				</CreateCommandArea>
			</CommandModalBody>
		</Modal>
	);
};

const CustomCommands = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];
	const [localCommands, setLocalCommands] = useState<commandMap>({});
	const [commandModalOpen, setCommandModalOpen] = useState(false);
	const collectionRef = firebaseClient.db.collection("customCommands");
	const [snapshot, loading, error] = useDocumentData(collectionRef.doc(serverId));
	const [commandBeingEdited, setCommandBeingEdited] = useState<command | null>(null);

	useEffect(() => {
		if (!snapshot) {
			collectionRef.doc(serverId).set({}, { merge: true });
		} else {
			setLocalCommands(snapshot);
		}
	}, [snapshot]);

	const commands: [string, command][] = Object.entries(localCommands || {})
		.filter(([key, val]) => val.type === "text")
		.sort();

	const changed = !isEqual(snapshot ?? {}, localCommands);

	const deleteMe = key => {
		setLocalCommands(prev => {
			const copy = { ...prev };
			delete copy[key];
			return copy;
		});
	};

	const save = () => {
		collectionRef.doc(serverId).set(localCommands);
	};

	const createCommand = () => {
		setCommandBeingEdited(null);
		setCommandModalOpen(true);
	};

	const edit = command => {
		setCommandBeingEdited(command);
		setCommandModalOpen(true);
	};

	return (
		<div>
			<CommandModal
				open={commandModalOpen}
				onClose={() => setCommandModalOpen(false)}
				defaultValue={commandBeingEdited}
			></CommandModal>
			<CommandsHeader>
				<span>
					<H2>Text Command</H2>
					<h4>A simple command that responds with a custom message in DM or public</h4>
				</span>
				<span>
					<BlueButton onClick={createCommand}>Create Command</BlueButton>
				</span>
			</CommandsHeader>
			<span>
				<H2>Commands - {commands?.length}</H2>
				<ul>
					{snapshot &&
						commands.map(([key, val]) => (
							<ListItem delete={() => deleteMe(key)} edit={() => edit(val)}>
								<div>
									<img src="/speech.svg" alt="" width="50" />
								</div>
								<div>
									<H3>{key}</H3>
									<div>{val.description}</div>
								</div>
							</ListItem>
						))}
				</ul>
			</span>
			<SaveBar changed={changed} save={save} reset={() => setLocalCommands(snapshot)} />
		</div>
	);
};

export default CustomCommands;
