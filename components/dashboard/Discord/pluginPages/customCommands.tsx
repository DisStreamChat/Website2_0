import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { H1, H2, H3, H4 } from "../../../shared/styles/headings";
import { BlueButton, DeleteButton } from "../../../shared/ui-components/Button";
import { PluginSubHeader } from "./styles";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebaseClient from "../../../../firebase/client";
import ListItem from "../../../shared/ui-components/ListItem";
import { isEqual } from "lodash";
import SaveBar from "../../../shared/ui-components/SaveBar";
import Modal from "../../../shared/ui-components/Modal";
import { command, commandMap, role as Role, Action as action } from "../../../../utils/types";
import ClearIcon from "@material-ui/icons/Clear";
import { discordContext } from "../discordContext";
import { TextArea, TextInput } from "../../../shared/ui-components/TextField";
import Select from "../Select";
import { parseSelectValue, transformObjectToSelectValue } from "../../../../utils/functions";
import RoleItem, { RoleOption } from "../RoleItem";
import { gapFunction } from "../../../shared/styles";
import { SectionTitle, SectionSubtitle } from "../../../shared/styles/plugins";
import { ChannelItem } from "../ChannelItem";
import {
	channelAutoComplete,
	emoteAutoComplete,
	generalItems,
	roleAutoComplete,
} from "../../../../utils/functions/autocomplete";
import { EmoteParent, EmotePicker, EmotePickerOpener } from "../../../shared/ui-components/emotePicker";

const CommandsHeader = styled(PluginSubHeader)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	align-items: flex-start;
	& > * + * {
		margin-top: 1rem;
		margin-left: 0;
	}
	margin-bottom: 1rem;
`;

const CommandModalBody = styled.div`
	width: 100vw;
	height: 100vh;
	background: var(--background-light-gray);
	position: relative;
`;

const actions = {
	UPDATE: "update",
	SET: "set",
	CLEAR: "clear",
	RESET: "clear",
	UPDATEARRAY: "array",
	REMOVEARRAY: "remove",
};

const defaultCommand = serverId => ({
	DM: false,
	allowedChannels: [],
	bannedRoles: [],
	cooldown: 0,
	cooldownTime: 0,
	deleteUsage: false,
	description: "An Awesome Command",
	lastUsed: 0,
	message: "",
	name: "",
	permittedRoles: [serverId],
	role: false,
	type: "text",
});

const commandReducer = (state: command, action: action) => {
	switch (action.type) {
		case actions.UPDATE:
			return {
				...state,
				[action.key]:
					typeof action.value === "function"
						? action.value(state[action.key])
						: action.value,
			};
		case actions.SET:
			return action.value;
		case actions.CLEAR:
		case actions.RESET:
			return defaultCommand(action.server);
		case actions.UPDATEARRAY:
			return { ...state, [action.key]: [...state[action.key], action.value] };
		case actions.REMOVEARRAY:
			return {
				...state,
				[action.key]: state[action.key].filter(item => item !== action.value),
			};

		default:
			return state;
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
	border-bottom: 1px solid #999;
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

const CreateCommandArea = styled.div`
	padding: 2rem;
	padding-bottom: 6rem;
	scroll-behavior: smooth;
	hr {
		border-color: #aaaaaa33;
		margin: 1rem 0;
	}
	overflow: auto;
	max-height: calc(100vh - 70px);
`;

const CreateCommandFooter = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0.75rem;
	display: flex;
	justify-content: flex-end;
	background: var(--background-dark-gray);
	${gapFunction({ gap: "1rem" })}
`;



const CommandModal = ({ defaultValue, ...props }) => {
	const router = useRouter();
	const [, serverId, pluginName] = router.query.type as string[];
	const { serverSettings, roles, allChannels, emotes } = useContext(discordContext);
	const [emotePickerVisible, setEmotePickerVisible] = useState(false);

	const [state, dispatch] = useReducer<(state: command, action: action) => command, command>(
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

	const create = async () => {
		const docRef = firebaseClient.db.collection("customCommands").doc(serverId);

		await docRef.set({ [state.name]: state }, { merge: true });

		props.onClose();
	};

	return (
		<Modal open={props.open} onClose={props.onClose}>
			<CommandModalBody>
				<CommandHeader>
					<H2>{defaultValue ? "Edit" : "Create Text"} Command</H2>
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
					<EmoteParent>
						<EmotePickerOpener onClick={() => setEmotePickerVisible(true)}>
							<img width="24" height="24" src="/smile.svg" alt="" />
						</EmotePickerOpener>
						<EmotePicker
							onClickAway={() => {
								setEmotePickerVisible(false);
							}}
							visible={emotePickerVisible}
							emotes={emotes}
							onEmoteSelect={emote => {
								dispatch({
									type: actions.UPDATE,
									value: prev => `${prev} ${emote.colons}`,
									key: "message",
								});
								setEmotePickerVisible(false);
							}}
						/>
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
										return generalItems
											.filter(chatter => chatter.includes(token))
											.map(chatter => ({
												name: `${chatter}`,
												char: `{${chatter}}`,
											}));
									},
									component: ({ selected, entity: { name, char } }) => (
										<div
											className={`text-area-item ${
												selected ? "selected" : ""
											}`}
										>
											{name}
										</div>
									),
									output: (item, trigger) => item.char,
								},
								"#": channelAutoComplete(allChannels),
								"@": roleAutoComplete(roles),
								// ":": emoteAutoComplete()
							}}
						></TextArea>
					</EmoteParent>
					<hr />
					<SectionTitle>Command Description</SectionTitle>
					<TextInput
						placeholder="An Awesome Command"
						value={state.description}
						onChange={e => {
							console.log(e.target.value);
							dispatch({
								type: actions.UPDATE,
								value: e.target.value,
								key: "description",
							});
						}}
					/>
					<hr />
					<SectionTitle>Allowed Roles</SectionTitle>
					<SectionSubtitle>
						Anyone with these roles can use this command. Adding @everyone means
						everyone!
					</SectionSubtitle>
					<Select
						value={state.permittedRoles.map(id => {
							const role = roles.find(role => role.id === id);
							if (!role) return { value: "", label: "" };
							return {
								label: (
									<RoleItem
										onClick={id => {
											dispatch({
												type: actions.REMOVEARRAY,
												value: id,
												key: "permittedRoles",
											});
										}}
										{...role}
									></RoleItem>
								),
								value: transformObjectToSelectValue(role),
							};
						})}
						options={roles.map(role => ({
							value: transformObjectToSelectValue(role),
							label: <RoleOption {...role}>{role.name}</RoleOption>,
						}))}
						onChange={value => {
							const roleId = parseSelectValue(value);
							dispatch({
								type: actions.UPDATEARRAY,
								key: "permittedRoles",
								value: roleId,
							});
						}}
					/>
					<hr />
					<SectionTitle>Banned Roles</SectionTitle>
					<SectionSubtitle>
						Anyone with these roles can't use this command.
					</SectionSubtitle>
					<Select
						value={state.bannedRoles.map(id => {
							const role = roles.find(role => role.id === id);
							if (!role) return { value: "", label: "" };
							return {
								label: (
									<RoleItem
										onClick={id => {
											dispatch({
												type: actions.REMOVEARRAY,
												value: id,
												key: "permittedRoles",
											});
										}}
										{...role}
									></RoleItem>
								),
								value: transformObjectToSelectValue(role),
							};
						})}
						options={roles
							.filter(({ id }) => !state.permittedRoles.includes(id))
							.map(role => ({
								value: transformObjectToSelectValue(role),
								label: <RoleOption {...role}>{role.name}</RoleOption>,
							}))}
						onChange={value => {
							const roleId = parseSelectValue(value);
							dispatch({
								type: actions.UPDATEARRAY,
								key: "bannedRoles",
								value: roleId,
							});
						}}
					/>
					<hr />
					<SectionTitle>Allowed Channels</SectionTitle>
					<SectionSubtitle>
						The command can only be used in these channels. Selecting none means it can
						be used anywhere
					</SectionSubtitle>
					<Select
						value={state.allowedChannels.map(id => {
							const role = roles.find(role => role.id === id);
							if (!role) return { value: "", label: "" };
							return {
								label: (
									<RoleItem
										onClick={id => {
											dispatch({
												type: actions.REMOVEARRAY,
												value: id,
												key: "allowedChannels",
											});
										}}
										{...role}
									></RoleItem>
								),
								value: transformObjectToSelectValue(role),
							};
						})}
						options={roles.map(role => ({
							value: transformObjectToSelectValue(role),
							label: <RoleOption {...role}>{role.name}</RoleOption>,
						}))}
						onChange={value => {
							const roleId = parseSelectValue(value);
							dispatch({
								type: actions.UPDATEARRAY,
								key: "permittedRoles",
								value: roleId,
							});
						}}
					/>
				</CreateCommandArea>
				<CreateCommandFooter>
					<DeleteButton onClick={props.onClose}>Cancel</DeleteButton>
					<BlueButton onClick={create}>{defaultValue ? "Update" : "Create"}</BlueButton>
				</CreateCommandFooter>
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
