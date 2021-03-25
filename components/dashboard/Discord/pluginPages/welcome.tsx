import React, { useReducer, useState, useEffect, useContext } from "react";
import firebaseClient from "../../../../firebase/client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { isEqual } from "lodash";
import { useRouter } from "next/router";
import { Action } from "../../../../utils/types";
import { SectionTitle } from "../../../shared/styles/plugins";
import Select from "../../../shared/ui-components/Select";
import { parseSelectValue, transformObjectToSelectValue } from "../../../../utils/functions";
import { ChannelItem } from "../ChannelItem";
import { discordContext } from "../discordContext";
import SaveBar from "../../../shared/ui-components/SaveBar";
import { TextArea } from "../../../shared/ui-components/TextField";
import styled from "styled-components";
import { channelAutoComplete, generalItems } from "../../../../utils/functions/autocomplete";
import {
	EmoteParent,
	EmotePicker,
	EmotePickerOpener,
} from "../../../shared/ui-components/emotePicker";

const actions = {
	UPDATE: "update",
	SET: "set",
	CLEAR: "clear",
	RESET: "clear",
};

interface welcomeMessage {
	channel: string;
	message: string;
	welcomeCard?: string;
	type?: string;
}

const defaultWelcomeMessage = (): welcomeMessage => {
	return {
		type: "",
		channel: "",
		message: "Welcome to {server}, {member}",
		welcomeCard: "",
	};
};

const welcomeReducer = (state: welcomeMessage, action: Action) => {
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
		case actions.RESET:
		case actions.CLEAR:
			return defaultWelcomeMessage();
	}
};

const WelcomeArea = styled.div`
	& + * {
		margin-top: 1rem;
	}
	&.top {
		&,
		& * {
			z-index: 1000;
		}
	}
	textarea,
	.text-area-list {
		/* max-width: 80%; */
	}
	/* display: flex; */
`;

const Welcome = () => {
	const router = useRouter();
	const [, serverId, pluginName] = router.query.type as string[];
	const docRef = firebaseClient.db.collection("DiscordSettings").doc(serverId);
	const [snapshot, loading, error] = useDocumentData(docRef);
	const { allChannels, emotes } = useContext(discordContext);
	const [emotePickerOpen, setEmotePickerOpen] = useState(false);

	const databaseWelcomeMessage = snapshot?.welcomeMessage;

	const [state, dispatch] = useReducer<
		(state: welcomeMessage, action: Action) => welcomeMessage,
		welcomeMessage
	>(welcomeReducer, defaultWelcomeMessage(), defaultWelcomeMessage);

	useEffect(() => {
		if (databaseWelcomeMessage) {
			dispatch({ type: actions.SET, value: databaseWelcomeMessage });
		}
	}, [databaseWelcomeMessage]);

	const welcomeChannel = allChannels.find(channel => channel.id === state.channel);

	const changed = !isEqual(databaseWelcomeMessage ?? defaultWelcomeMessage(), state);

	const save = () => {
		docRef.set({ welcomeMessage: state }, { merge: true });
	};

	const reset = () => {
		dispatch({ type: actions.SET, value: databaseWelcomeMessage });
	};

	return (
		<div>
			<WelcomeArea className="top">
				<SectionTitle>Welcome Channel</SectionTitle>
				<Select
					placeholder="Select a channel"
					onChange={value => {
						const channel = parseSelectValue(value);
						dispatch({ type: "update", key: "channel", value: channel });
					}}
					value={
						welcomeChannel
							? {
									value: transformObjectToSelectValue(welcomeChannel),
									label: <ChannelItem {...welcomeChannel} />,
							  }
							: null
					}
					options={allChannels.map(channel => ({
						value: transformObjectToSelectValue(channel),
						label: <ChannelItem {...channel} />,
					}))}
				/>
			</WelcomeArea>
			<WelcomeArea>
				<SectionTitle>Welcome Message</SectionTitle>
				<EmoteParent style={{ maxWidth: "80%" }}>
					<EmotePickerOpener onClick={() => setEmotePickerOpen(true)}>
						<img width="24" height="24" src="/smile.svg" alt="" />
					</EmotePickerOpener>
					<EmotePicker
						onEmoteSelect={emote => {
							dispatch({
								type: actions.UPDATE,
								key: "message",
								value: prev => `${prev} ${emote.colons}`,
							});
						}}
						visible={emotePickerOpen}
						emotes={emotes}
						onClickAway={() => setEmotePickerOpen(false)}
					/>
					<TextArea
						value={state.message}
						onChange={e =>
							dispatch({
								type: actions.UPDATE,
								key: "message",
								value: e.target.value,
							})
						}
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
									<div className={`text-area-item ${selected ? "selected" : ""}`}>
										{name}
									</div>
								),
								output: (item, trigger) => item.char,
							},
							"#": channelAutoComplete(allChannels),
						}}
					></TextArea>
				</EmoteParent>
			</WelcomeArea>
			<SaveBar changed={changed} save={save} reset={reset} />
		</div>
	);
};

export default Welcome;
