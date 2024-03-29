import React, { useContext, useEffect, useReducer, useState } from "react";
import { discordContext } from "../discordContext";
import styled from "styled-components";
import { H1, H2, H3 } from "../../../shared/styles/headings";
import { Switch, TextField } from "@material-ui/core";
import { Action, channel, role } from "../../../../utils/types";
import firebaseClient from "../../../../firebase/client";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { unset, get, set, isEqual, cloneDeep, isEmpty } from "lodash";
import { motion } from "framer-motion";
import StyledSelect from "../../../shared/styles/styled-select";
import RoleItem, { RoleOption } from "../RoleItem";
import {
	parseSelectValue,
	transformObjectToSelectValue,
	TransformObjectToSelectValue,
} from "../../../../utils/functions";
import SaveBar from "../../../shared/ui-components/SaveBar";
import { ListItem } from "../../../shared/ui-components/ListItem";
import { BlueButton, DeleteButton, PaddingButton } from "../../../shared/ui-components/Button";
import {
	CommandHeader,
	CommandModal,
	CommandModalBody,
	CommandsHeader,
	CreateCommandArea,
	CreateCommandFooter,
} from "./customCommands";
import Select from "../Select";
import Modal from "../../../shared/ui-components/Modal";
import ClearIcon from "@material-ui/icons/Clear";
import { SectionSubtitle, SectionTitle } from "../../../shared/styles/plugins";
import {
	generalItems,
	channelAutoComplete,
	roleAutoComplete,
	emoteAutoComplete,
} from "../../../../utils/functions/autocomplete";
import {
	EmoteParent,
	EmotePickerOpener,
	EmotePicker,
} from "../../../shared/ui-components/emotePicker";
import { TextArea } from "../../../shared/ui-components/TextField";
import { ChannelItem, ChannelOption } from "../ChannelItem";
import { gapFunction } from "../../../shared/styles";
import Twemoji from "react-twemoji";
import { uid } from "uid";
import { REACTION_ROLE_ACTION_TYPES } from "../../../../utils/constants";

interface settingsBase {
	open: boolean;
}

interface DescriptionModel extends settingsBase {
	roles: { [id: string]: string };
}

interface JoinModel extends settingsBase {
	roles: role[];
}

interface CommandsModel extends settingsBase {
	commands: any[];
}

interface ReactionsModel extends settingsBase {
	messages: { [key: string]: any };
}

interface RoleSettings {
	reactions: ReactionsModel;
	commands: CommandsModel;
	join: JoinModel;
	descriptions: DescriptionModel;
}

const roleFactory = (): RoleSettings => {
	return {
		reactions: { open: false, messages: {} },
		commands: { open: false, commands: [] },
		join: { open: false, roles: [] },
		descriptions: { open: false, roles: {} },
	};
};

interface sectionProps {
	id: string;
	title: string;
	open?: boolean;
	setOpen?: (val: boolean) => void;
}

const StyledRoleSection = styled.section`
	h5 {
		color: rgb(255, 255, 255);
		font-weight: 600;
		font-size: 16px;
	}
	border-bottom: 1px solid #aaaaaa44;
	&:first-child {
		margin-top: 1rem;
	}
`;

const RoleSectionTitle = styled.div`
	padding: 1.5rem 0;
	display: flex;
	justify-content: space-between;
`;

const RoleSectionBody = styled(motion.div)`
	/* overflow: hidden; */
`;

const roleSectionVariants = {
	open: {
		height: "auto",
		overflow: "visible",
	},
	closed: {
		height: "0px",
		overflow: "hidden",
	},
};

const RoleSectionPadding = styled.div`
	padding: 0.5rem 0;
`;

const RoleSection: React.FC<sectionProps> = props => {
	return (
		<StyledRoleSection>
			<RoleSectionTitle>
				<h5>{props.title}</h5>
				<Switch
					color="primary"
					onChange={e => props.setOpen(e.target.checked)}
					checked={props?.open}
				></Switch>
			</RoleSectionTitle>
			<RoleSectionBody
				variants={roleSectionVariants}
				animate={props?.open ? "open" : "closed"}
			>
				<RoleSectionPadding>
					<div>{props.children}</div>
				</RoleSectionPadding>
			</RoleSectionBody>
		</StyledRoleSection>
	);
};

const actions = {
	UPDATE: "update",
	RESET: "reset",
	SET: "set",
	DELETE: "delete",
};

function deletePropertyPath(obj, path) {
	if (!obj || !path) {
		return;
	}

	if (typeof path === "string") {
		path = path.split(".");
	}

	for (var i = 0; i < path.length - 1; i++) {
		obj = obj[path[i]];

		if (typeof obj === "undefined") {
			return;
		}
	}

	delete obj[path.pop()];
}

const settingsReducer = (state: any, action: Action) => {
	switch (action.type) {
		case actions.UPDATE:
			const obj = set(
				{ ...state },
				action.key,
				typeof action.value === "function"
					? action.value(get(state, action.key))
					: action.value
			);
			return obj;
		case actions.RESET:
			return roleFactory();
		case actions.SET:
			return action.value;
		case actions.DELETE:
			const copy = cloneDeep(state);
			unset(copy, action.key);
			return copy;
		default:
			return state;
	}
};

const DescriptionItem = styled.li`
	margin: 1rem 0 !important;
	display: flex;
	justify-content: space-between;
	gap: 2rem;
	max-width: 30%;
	align-items: center;
`;

interface ReactionRoleModel {
	message: string;
	channel: channel;
	reactions: { [emote: string]: { emoteData: any; roles: string[] | string | role | role[] } };
}

const reactionFactory = () => ({
	message: "",
	channel: null,
	reactions: {},
});

const ButtonContainer = styled.div`
	display: flex;
	${gapFunction({ gap: "1rem" })}
`;

const Warning = styled.div`
	margin-bottom: 5px;
	margin-top: 10px;
	background-color: rgba(250, 165, 27, 0.3);
	color: rgb(250, 165, 27);
	border-radius: 3px;
	border: 1px solid rgb(250, 165, 27);
	padding: 10px;
	display: flex;
	flex-direction: row;
`;

const Error = styled.div`
	margin-bottom: 5px;
	margin-top: 10px;
	background-color: rgba(250, 27, 27, 0.07);
	color: rgb(252, 79, 79);
	border-radius: 3px;
	border: 1px solid rgb(255, 48, 48);
	padding: 10px;
	display: flex;
	flex-direction: row;
`;

const ReactionRoleModal = ({ defaultValue, ...props }) => {
	const router = useRouter();
	const [, serverId, pluginName] = router.query.type as string[];
	const { serverSettings, roles, allChannels, emotes } = useContext(discordContext);
	const [emotePickerVisible, setEmotePickerVisible] = useState(false);
	const [creatingReaction, setCreatingReaction] = useState(null);
	const [roleErrors, setRoleErrors] = useState<any>({});
	const [positions, setPositions] = useState(null);
	const [formErrors, setFormErrors] = useState<any>({});
	const [savedDefault, setSavedDefault] = useState({});

	const [state, dispatch] = useReducer(
		settingsReducer,
		defaultValue ?? reactionFactory(),
		reaction => reaction
	);

	useEffect(() => {
		if (defaultValue) {
			dispatch({ type: actions.SET, value: cloneDeep(defaultValue) });
			setSavedDefault(cloneDeep(defaultValue));
		} else {
			dispatch({ type: actions.SET, value: reactionFactory() });
			setSavedDefault(null);
		}
	}, [defaultValue]);

	const create = async () => {
		const errors: any = {};
		if (!state.channel) {
			errors.channel = "Required";
		}
		if (!state.message?.length) {
			errors.message = "Required";
		}
		if (isEmpty(state.reactions)) {
			errors.reactions = "Required";
		} else {
			for (const reaction of Object.entries(state.reactions || {})) {
				const [emote, data]: [string, any] = reaction;
				if (!data.roles?.length) {
					errors[emote] = "Required";
				}
				if (!data.type) {
					errors[`${emote}-type`] = "Required";
				}
			}
		}
		setFormErrors(errors);
		if (!isEmpty(errors)) return;
		props.onSuccess(state, savedDefault);
		props.onClose();
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/position?server=${serverId}`
				);
				const json = await response.json();
				setPositions(json);
			} catch (err) {
				console.log(err.message);
			}
		})();
	}, [serverId]);

	useEffect(() => {
		for (const entry of Object.entries(state.reactions || {})) {
			const [key, value]: [string, any] = entry;
			let hasError = false;
			for (const role of value.roles) {
				if (role.rawPosition > positions?.rawPosition) {
					hasError = true;
				}
			}
			setRoleErrors(prev => ({ ...prev, [key]: hasError }));
		}
	}, [state]);

	return (
		<Modal open={props?.open} onClose={props.onClose}>
			<CommandModalBody>
				<CommandHeader>
					<H2>{defaultValue ? "Edit" : "Create"} Reaction Role Message</H2>
					<button onClick={props.onClose}>
						<ClearIcon />
					</button>
				</CommandHeader>
				<CreateCommandArea className="small">
					<SectionTitle>Message Channel</SectionTitle>
					<StyledSelect
						placeholder="Select a Channel"
						value={
							state.channel
								? {
										value: transformObjectToSelectValue(state.channel),
										label: <ChannelItem {...state.channel} />,
								  }
								: undefined
						}
						options={allChannels.map(channel => ({
							value: transformObjectToSelectValue(channel),
							label: <ChannelItem {...channel}>{channel.name}</ChannelItem>,
						}))}
						onChange={value => {
							const channel = parseSelectValue(value, true);
							dispatch({
								type: actions.UPDATE,
								key: "channel",
								value: channel,
							});
							setFormErrors(prev => ({ ...prev, channel: null }));
						}}
					></StyledSelect>
					{formErrors.channel === "Required" && <Error>Please Select a channel</Error>}
					<hr></hr>
					<SectionTitle>Message Content</SectionTitle>
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
								const emoteText = emote.imageUrl
									? `<${emote.colons}${emote.imageUrl
											.split("/")
											.slice(-1)[0]
											.slice(0, -4)}>`
									: emote.colons;
								dispatch({
									type: actions.UPDATE,
									value: prev => `${prev ?? ""} ${emoteText}`,
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
								setFormErrors(prev => ({ ...prev, message: null }));
							}}
							trigger={{
								"#": channelAutoComplete(allChannels),
								"@": roleAutoComplete(roles),
								":": emoteAutoComplete(emotes),
							}}
						></TextArea>
					</EmoteParent>
					{formErrors.message === "Required" && <Error>Message is required</Error>}
					<hr />
					<SectionTitle>Reactions</SectionTitle>
					<SectionSubtitle>
						A catch all reaction will run when any reaction is made, while a regular
						reaction will only run on when its emoji is reacted with
					</SectionSubtitle>
					<ButtonContainer>
						<div style={{ position: "relative" }}>
							<BlueButton onClick={() => setCreatingReaction({ type: "normal" })}>
								Add a Reaction
							</BlueButton>
							{creatingReaction?.type === "normal" && (
								<EmotePicker
									onClickAway={() => {
										setCreatingReaction(false);
									}}
									left=".5rem"
									visible={!creatingReaction?.emote}
									emotes={emotes}
									onEmoteSelect={emote => {
										const id = emote.imageUrl
											? emote.imageUrl.split("/").slice(-1)[0].slice(0, -4)
											: emote.native;
										dispatch({
											type: actions.UPDATE,
											value: { roles: [], emoteData: emote },
											key: `reactions[${id}]`,
										});
										setCreatingReaction(prev => ({
											...prev,
											emote: emote.id,
										}));
									}}
								/>
							)}
						</div>
						<BlueButton
							disabled={state.reactions["catch-all"]}
							onClick={() => {
								dispatch({
									type: actions.UPDATE,
									key: "reactions[catch-all]",
									value: {
										roles: [],
										emoteData: { catchAll: true, imageUrl: "/asterisk.webp" },
									},
								});
							}}
						>
							Add a catch all Reaction
						</BlueButton>
					</ButtonContainer>
					{formErrors.reactions === "Required" &&
						Object.entries(state.reactions || {}).length === 0 && (
							<Error>Please add atleast one reaction</Error>
						)}
					{Object.entries(state.reactions || {}).map(([emote, data]: [string, any]) => (
						<>
							<ListItem
								delete={() => {
									dispatch({ type: actions.DELETE, key: `reactions[${emote}]` });
								}}
							>
								{data.emoteData.native ? (
									<Twemoji options={{ className: "bigify" }}>
										{data.emoteData.native}
									</Twemoji>
								) : (
									<img
										draggable="false"
										className="bigify"
										src={data.emoteData.imageUrl}
										alt={data.emoteData.id}
									></img>
								)}
								<div style={{ minWidth: "50%" }}>
									<Select
										value={data.roles?.map(role => {
											if (!role) return { value: "", label: "" };
											return {
												label: (
													<RoleItem
														onClick={id => {
															console.log(id);
															dispatch({
																type: actions.UPDATE,
																value: prev =>
																	prev.filter(
																		item => item.id !== id
																	),
																key: `reactions[${emote}].roles`,
															});
														}}
														{...role}
													></RoleItem>
												),
												value: transformObjectToSelectValue(role),
											};
										})}
										options={roles
											.filter(
												channel =>
													!channel.managed && channel.name !== "@everyone"
											)
											.map(role => ({
												value: transformObjectToSelectValue(role),
												label: (
													<RoleOption {...role}>{role.name}</RoleOption>
												),
											}))}
										onChange={value => {
											const roleId = parseSelectValue(value, true);
											dispatch({
												type: actions.UPDATE,
												key: `reactions[${emote}].roles`,
												value: prev => [...(prev || []), roleId],
											});
											setFormErrors(prev => ({ ...prev, [emote]: null }));
										}}
									/>
									{formErrors[emote] === "Required" && (
										<Error>Please add atleast one role</Error>
									)}
									{roleErrors[emote] && (
										<Warning>
											Whoops, it looks like I can't give one of the roles
											listed here. Please fix that by putting my role above
											all the roles listed here, or remove any roles above
											mine from the list.
										</Warning>
									)}
								</div>
								<div style={{ minWidth: "50%" }}>
									<StyledSelect
										placeholder="Select Action Type"
										value={
											data?.type
												? {
														value: data?.type,
														label: `Action Type: ${
															REACTION_ROLE_ACTION_TYPES[data?.type]
														}`,
												  }
												: ""
										}
										options={Object.entries(
											REACTION_ROLE_ACTION_TYPES || {}
										)?.map(([key, value]) => ({
											value: key,
											label: value,
										}))}
										onChange={e => {
											dispatch({
												type: actions.UPDATE,
												key: `reactions[${emote}].type`,
												value: e.value,
											});
											setFormErrors(prev => ({
												...prev,
												[`${emote}-type`]: null,
											}));
										}}
									></StyledSelect>
									{formErrors[`${emote}-type`] === "Required" && (
										<Error style={{ maxWidth: "80%" }}>
											Please select a type
										</Error>
									)}
								</div>
							</ListItem>
						</>
					))}
				</CreateCommandArea>
				<CreateCommandFooter>
					<DeleteButton onClick={props.onClose}>Cancel</DeleteButton>
					<BlueButton onClick={create}>{defaultValue ? "Update" : "Create"}</BlueButton>
				</CreateCommandFooter>
			</CommandModalBody>
		</Modal>
	);
};

const RoleManagement = () => {
	const router = useRouter();

	const [, serverId] = router.query.type as string[];

	const { roles, allChannels, emotes } = useContext(discordContext);
	const [{ reactions, commands, join, descriptions }, dispatch] = useReducer<
		(state: RoleSettings, action: Action) => RoleSettings,
		RoleSettings
	>(settingsReducer, roleFactory(), roleFactory);
	const [localSettings, setLocalSettings] = useState(() => roleFactory());
	const [commandModalOpen, setCommandModalOpen] = useState(false);
	const [commandBeingEdited, setCommandBeingEdited] = useState(null);
	const [reactionModalOpen, setReactionModalOpen] = useState(false);
	const [reactionBeingEdited, setReactionBeingEdited] = useState(null);

	const docRef = firebaseClient.db.collection("roleManagement").doc(serverId);

	const [snapshot] = useDocumentData(docRef);

	useEffect(() => {
		
		if (snapshot && Object.keys(snapshot||{}).length) {
			setLocalSettings(cloneDeep(snapshot));
			dispatch({ type: actions.SET, value: cloneDeep(snapshot) });
		} else {
			docRef.set({}, { merge: true });
		}
	}, [snapshot]);

	const changed = !isEqual(localSettings, { reactions, commands, join, descriptions });

	const notEveryone = roles.filter(role => role.name !== "@everyone");

	const notManaged = notEveryone.filter(role => !role.managed);

	const roleOptions = notEveryone.filter(
		role => descriptions?.roles?.[TransformObjectToSelectValue(role)] === undefined
	);

	const save = () => {
		docRef.update({ reactions, commands, join, descriptions });
	};

	const createCommand = () => {
		setCommandBeingEdited(null);
		setCommandModalOpen(true);
	};

	const edit = command => {
		setCommandBeingEdited(command);
		setCommandModalOpen(true);
	};

	const createReactionRole = () => {
		setReactionBeingEdited(null);
		setReactionModalOpen(true);
	};

	const editReactionRole = reaction => {
		setReactionBeingEdited(reaction);
		setReactionModalOpen(true);
	};

	return (
		<>
			<RoleSection
				title="Let your members get roles by reacting to a message"
				id="reactions"
				open={reactions?.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "reactions.open", value: val });
				}}
			>
				<ReactionRoleModal
					defaultValue={reactionBeingEdited}
					open={reactionModalOpen}
					onClose={() => setReactionModalOpen(false)}
					onSuccess={async (state, editingReaction) => {
						const res = await fetch(
							`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/reactionmessage?key=caba961043ffe91c46d08b1a8e8d060de7617c07`,
							{
								method: editingReaction ? "PATCH" : "POST",
								body: JSON.stringify({
									server: serverId,
									reactions: Object.keys(state.reactions ||{}),
									message: state.message,
									channel: state.channel.id,
									messageId: editingReaction?.id,
								}),
								headers: {
									"content-type": "application/json",
								},
							}
						);
						const json = await res.json();
						docRef.update({
							reactions: {
								open: true,
								messages: {
									...(reactions?.messages || []),
									[json.messageId]: state,
								},
							},
						});
					}}
				></ReactionRoleModal>
				<CommandsHeader>
					<span>
						<H2>Reaction Roles</H2>
						<h4>
							allow users to give/remove roles from themselves by reacting to a
							message
						</h4>
					</span>
					<span>
						<BlueButton onClick={createReactionRole}>
							Create Reaction Role Message
						</BlueButton>
					</span>
				</CommandsHeader>
				<span>
					<H2>Messages - {Object.entries(reactions.messages || {})?.length || 0}</H2>
					{Object.entries(reactions.messages || {}).map(([key, value]: [string, any]) => (
						<ListItem
							edit={() => editReactionRole({ id: key, ...value })}
							delete={async () => {
								await fetch(
									`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/reactionmessage?key=caba961043ffe91c46d08b1a8e8d060de7617c07`,
									{
										method: "DELETE",
										body: JSON.stringify({
											server: serverId,
											message: key,
											channel: value.channel.id,
										}),
										headers: {
											"content-type": "application/json",
										},
									}
								);
								docRef.update({
									[`reactions.messages.${key}`]: firebaseClient.app.firestore.FieldValue.delete(),
								});
							}}
						>
							<div>
								<ChannelItem {...value.channel}></ChannelItem>
								{Object.entries(value.reactions || {}).map(
									([emote, data]: [string, any]) => (
										<ListItem>
											{data.emoteData.native ? (
												<Twemoji options={{ className: "bigify" }}>
													{data.emoteData.native}
												</Twemoji>
											) : (
												<img
													draggable="false"
													className="bigify"
													src={data.emoteData.imageUrl}
													alt={data.emoteData.id}
												></img>
											)}
											{data.roles.map(role => (
												<RoleItem {...role}></RoleItem>
											))}
										</ListItem>
									)
								)}
							</div>
						</ListItem>
					))}
				</span>
			</RoleSection>
			<RoleSection
				title="Let your members get roles with commands"
				id="commands"
				open={commands?.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "commands.open", value: val });
				}}
			>
				<CommandModal
					role
					open={commandModalOpen}
					onClose={() => setCommandModalOpen(false)}
					onSuccess={async state => {
						docRef.update({
							commands: {
								open: true,
								commands: {
									...(commands?.commands || {}),
									[state.name]: { ...state, type: "role" },
								},
							},
						});
					}}
					defaultValue={commandBeingEdited}
				></CommandModal>
				<CommandsHeader>
					<span>
						<H2>Role Command</H2>
						<h4>allow users to give/remove roles from themselves with a command</h4>
					</span>
					<span>
						<BlueButton onClick={createCommand}>Create Command</BlueButton>
					</span>
				</CommandsHeader>
				<span>
					<H2>Commands - {Object.entries(commands.commands || {})?.length || 0}</H2>
					<ul>
						{Object.entries(commands.commands || {}).map(([key, val]) => (
							<ListItem
								delete={() => {
									docRef.update({
										[`commands.commands.${val.name}`]: firebaseClient.app.firestore.FieldValue.delete(),
									});
								}}
								edit={() => {
									edit(val);
								}}
							>
								<div>
									<img src="/role.svg" alt="" width="50" />
								</div>
								<div>
									<H3>{key}</H3>
									<div>{val.description}</div>
								</div>
								<div style={{ marginLeft: "2rem" }}>
									{val.roles.map(role => (
										<RoleItem {...role}></RoleItem>
									))}
								</div>
							</ListItem>
						))}
					</ul>
				</span>
			</RoleSection>
			<RoleSection
				title="Give members a role on join"
				id="join"
				open={join?.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "join.open", value: val });
				}}
			>
				<Select
					closeMenuOnSelect={false}
					options={notManaged
						?.filter(role => !join.roles?.find(({ id }) => role.id == id))
						?.map(role => ({
							value: TransformObjectToSelectValue(role),
							label: <RoleOption color={role.color}>{role.name}</RoleOption>,
						}))}
					onChange={opt => {
						const value = parseSelectValue(opt, true);
						dispatch({
							type: actions.UPDATE,
							key: "join.roles",
							value: prev => [...prev, value],
						});
					}}
					value={join.roles?.map(role => ({
						value: TransformObjectToSelectValue(role),
						label: (
							<RoleItem
								onClick={() => {
									dispatch({
										type: actions.UPDATE,
										key: "join.roles",
										value: join.roles.filter(r => r.id !== role.id),
									});
								}}
								{...role}
							></RoleItem>
						),
					}))}
				></Select>
			</RoleSection>
			<RoleSection
				title="Give descriptions to the roles in your server"
				open={descriptions?.open}
				id="descriptions"
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "descriptions.open", value: val });
				}}
			>
				<StyledSelect
					closeMenuOnSelect={true}
					placeholder="Add a role"
					options={roleOptions.map(role => ({
						value: TransformObjectToSelectValue(role),
						label: <RoleOption color={role.color}>{role.name}</RoleOption>,
					}))}
					onChange={option => {
						dispatch({
							type: actions.UPDATE,
							value: "",
							key: `descriptions.roles[${option.value}]`,
						});
					}}
					value={null}
				></StyledSelect>
				<H2 style={{ marginTop: "1rem" }}>
					Roles with descriptions - {roles.length - roleOptions.length - 1}
				</H2>
				<ul>
					{Object.entries(descriptions.roles || {})
						.sort()
						.map(([key, value]) => {
							const role = JSON.parse(key.split("=")[1]);
							return (
								<DescriptionItem>
									<RoleItem
										onClick={() =>
											dispatch({
												type: actions.DELETE,
												key: `descriptions.roles[${key}]`,
											})
										}
										{...role}
									>
										{role.name}
									</RoleItem>
									<TextField
										value={value}
										label="Description"
										variant="outlined"
										onChange={e =>
											dispatch({
												type: actions.UPDATE,
												value: e.target.value,
												key: `descriptions.roles[${key}]`,
											})
										}
									></TextField>
								</DescriptionItem>
							);
						})}
				</ul>
			</RoleSection>
			<SaveBar
				changed={changed}
				save={save}
				reset={() => dispatch({ type: actions.SET, value: cloneDeep(localSettings) })}
			></SaveBar>
		</>
	);
};

export default RoleManagement;
