import styled from "styled-components";
import React, { useReducer, useState, useContext, useEffect } from "react";
import { discordContext } from "../discordContext";
import { uid } from "uid";
import { Action, channel } from "../../../../utils/types";
import { H2 } from "../../../shared/styles/headings";
import { BlueButton } from "../../../shared/ui-components/Button";
import { ChannelItem } from "../ChannelItem";
import ListItem from "../../../shared/ui-components/ListItem";
import { PluginSubHeader } from "./styles";
import { Modal, Zoom } from "@material-ui/core";
import StyledSelect from "../../../shared/styles/styled-select";

import { useRouter } from "next/router";
import { H1, H3, H4 } from "../../../shared/styles/headings";
import { DeleteButton } from "../../../shared/ui-components/Button";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebaseClient from "../../../../firebase/client";
import { isEqual } from "lodash";
import SaveBar from "../../../shared/ui-components/SaveBar";
import { command, commandMap, role as Role, Action as action } from "../../../../utils/types";
import ClearIcon from "@material-ui/icons/Clear";
import { TextArea, TextInput } from "../../../shared/ui-components/TextField";
import Select from "../Select";
import { parseSelectValue, transformObjectToSelectValue } from "../../../../utils/functions";
import RoleItem, { RoleOption } from "../RoleItem";
import { gapFunction } from "../../../shared/styles";
import { SectionTitle, SectionSubtitle } from "../../../shared/styles/plugins";
import {
	channelAutoComplete,
	emoteAutoComplete,
	generalItems,
	roleAutoComplete,
} from "../../../../utils/functions/autocomplete";
import {
	EmoteParent,
	EmotePicker,
	EmotePickerOpener,
} from "../../../shared/ui-components/emotePicker";
import { Save } from "@material-ui/icons";
import { splitByCaps } from "../../../../utils/functions/stringManipulation";

interface LogRecord {
	channel: channel;
	action: string;
	id: string;
	actionId?: string;
}

interface LogRecords {
	[id: string]: LogRecord;
}

interface LogAction extends Action {
	id?: string;
}

const logRecordFactory = (): LogRecord => ({
	channel: null,
	action: null,
	id: uid(),
	actionId: null,
});

const actions = {
	UPDATE: "update",
	RESET: "reset",
	SET: "set",
	UPDATEITEM: "item",
};

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

const reducer = (state: LogRecords | LogRecord, action: LogAction) => {
	switch (action.type) {
		case actions.UPDATEITEM:
			return {
				...state,
				[action.key]:
					action.value === "function" ? action.value(state[action.key]) : action.value,
			};
		case actions.UPDATE:
			const itemToUpdate = state[action.id];
			itemToUpdate[action.key] =
				typeof action.value === "function"
					? action.value(itemToUpdate[action.key])
					: action.value;
			return { ...state, [action.id]: itemToUpdate };
		case actions.RESET:
			return {};
		case actions.SET:
			return action.value;
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

const CommandModalBody = styled.div`
	width: 100vw;
	height: 100vh;
	background: var(--background-light-gray);
	position: relative;
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
	height: 100%;
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

const logActions = [
	"InviteCreate",
	"InviteDelete",
	"MemberAdd",
	"MemberBanned",
	"MemberRemove",
	"MemberUnbanned",
	"NicknameChange",
	"RolesChanged",
	"ServerEdit",
	"channelCreate",
	"channelDelete",
	"channelUpdate",
	"emojiCreate",
	"emojiDelete",
	"emojiUpdate",
	"messageDelete",
	"messageUpdate",
	"roleCreate",
	"roleDelete",
	"roleUpdate",
	"userUpdate",
];

const LogModal = ({ defaultValue, ...props }) => {
	const router = useRouter();
	const [, serverId, pluginName] = router.query.type as string[];
	const { serverSettings, roles, allChannels, emotes } = useContext(discordContext);
	const [emotePickerVisible, setEmotePickerVisible] = useState(false);

	const [state, dispatch] = useReducer<
		(state: LogRecord, action: LogAction) => LogRecord,
		LogRecord
	>(reducer, defaultValue ?? logRecordFactory(), record => record);

	useEffect(() => {
		if (defaultValue) {
			dispatch({ type: actions.SET, value: { ...defaultValue } });
		}
	}, [defaultValue]);

	const create = async () => {
		const docRef = firebaseClient.db.collection("customCommands").doc(serverId);

		await docRef.set({ [state.id]: state }, { merge: true });

		props.onClose();
	};

	return (
		<Modal open={props.open} onClose={props.onClose}>
			<Zoom in={props.open}>
				<CommandModalBody>
					<CommandHeader>
						<H2>{defaultValue ? "Edit" : "Create"} Log Action</H2>
						<button onClick={props.onClose}>
							<ClearIcon />
						</button>
					</CommandHeader>
					<CreateCommandArea>
						<SectionTitle>Action to Log</SectionTitle>
						<StyledSelect
							placeholder="Select Action"
							onChange={value => {
								const channel = parseSelectValue(value);

								dispatch({
									type: actions.UPDATE,
									key: "general.channel",
									value: channel,
								});
							}}
							value={
								state.action
									? {
										value: (state.action),
										label: splitByCaps(state.action),
									  }
									: null
							}
							options={logActions.map(action => ({
								value: (action),
								label: splitByCaps(action),
							}))}
						/>
						<hr />
						<SectionTitle>Log Channel</SectionTitle>
						<StyledSelect
							placeholder="Select Channel"
							onChange={value => {
								const channel = parseSelectValue(value);

								dispatch({
									type: actions.UPDATE,
									key: "general.channel",
									value: channel,
								});
							}}
							value={
								state.channel
									? {
											value: transformObjectToSelectValue(state.channel),
											label: <ChannelItem {...state.channel} />,
									  }
									: null
							}
							options={allChannels.map(channel => ({
								value: transformObjectToSelectValue(channel),
								label: <ChannelItem {...channel} />,
							}))}
						/>
						<hr />
					</CreateCommandArea>
					<CreateCommandFooter>
						<DeleteButton onClick={props.onClose}>Cancel</DeleteButton>
						<BlueButton onClick={create}>
							{defaultValue ? "Update" : "Create"}
						</BlueButton>
					</CreateCommandFooter>
				</CommandModalBody>
			</Zoom>
		</Modal>
	);
};

const Logging = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];
	const [localActions, setLocalActions] = useState<LogRecords>({});

	const collectionRef = firebaseClient.db.collection("logging");

	const [snapshot, loading, error] = useDocumentData(collectionRef.doc(serverId));

	const [modalOpen, setModalOpen] = useState(false);
	const [actionBeingEdited, setActionBeingEdited] = useState<LogRecord>(null);
	const logRecordList = Object.values(localActions);
	const logRecordCount = logRecordList.length;

	useEffect(() => {
		if (!snapshot) {
			collectionRef.doc(serverId).set({}, { merge: true });
		} else {
			setLocalActions(snapshot);
		}
	}, [snapshot]);

	const changed = !isEqual(snapshot ?? {}, localActions);

	const deleteMe = key => {
		setLocalActions(prev => {
			const copy = { ...prev };
			delete copy[key];
			return copy;
		});
	};

	const save = () => {
		collectionRef.doc(serverId).set(localActions, { merge: true });
	};

	const createCommand = () => {
		setActionBeingEdited(null);
		setModalOpen(true);
	};

	const edit = action => {
		setActionBeingEdited(action);
		setModalOpen(true);
	};

	return (
		<div>
			<LogModal
				onClose={() => setModalOpen(false)}
				open={modalOpen}
				defaultValue={actionBeingEdited}
			></LogModal>
			<CommandsHeader>
				<span>
					<H2>Logging Actions</H2>
					<h4>log different things that happen in your in whatever channel you want</h4>
				</span>
				<span>
					<BlueButton onClick={createCommand}>Add log action</BlueButton>
				</span>
			</CommandsHeader>
			<span>
				<H2>Logging Actions - {logRecordCount}</H2>
				<ul className="">
					{logRecordList.map(record => (
						<ListItem delete={() => {}} edit={() => edit(record)}>
							<H2>
								Log {record.action} in{" "}
								<ChannelItem {...record.channel}></ChannelItem>
							</H2>
						</ListItem>
					))}
				</ul>
			</span>
			<SaveBar
				changed={changed}
				save={save}
				reset={() => {
					setLocalActions(snapshot);
				}}
			/>
		</div>
	);
};

export default Logging;
