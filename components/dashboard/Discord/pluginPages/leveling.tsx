import { Switch, useMediaQuery } from "@material-ui/core";
import React, { useState, useContext, useEffect, useReducer } from "react";
import { H2 } from "../../../shared/styles/headings";
import { PluginSection, PluginSubHeader, SubSectionTitle } from "./styles";
import Select from "../../../shared/styles/styled-select";
import styled from "styled-components";
import { TextArea } from "../../../shared/ui-components/TextField";
import { discordContext } from "../discordContext";
import { parseSelectValue, transformObjectToSelectValue } from "../../../../utils/functions";
import { ChannelItem, ChannelOption } from "../ChannelItem";
import MultiSelect from "../Select";
import RoleItem, { RoleOption } from "../RoleItem";
import PrettoSlider from "../../../shared/ui-components/PrettoSlider";
import firebaseClient from "../../../../firebase/client";
import { useRouter } from "next/router";
import { allItems, channelAutoComplete, emoteAutoComplete } from "../../../../utils/functions/autocomplete";
import { Action } from "../../../../utils/types";
import { get, set, isEqual, cloneDeep } from "lodash";
import SaveBar from "../../../shared/ui-components/SaveBar";
import {
	EmoteParent,
	EmotePicker,
	EmotePickerOpener,
} from "../../../shared/ui-components/emotePicker";

const levelingVariants = {
	initial: {
		height: 0,
		opacity: 0,
	},
	open: {
		height: "auto",
		opacity: 1,
	},
	closed: {
		opacity: 0,
		height: 0,
	},
};

const AnnouncementSection = styled(PluginSection)`
	display: flex;
	& > div {
		flex: 1 1 45%;
	}
	@media screen and (max-width: 725px) {
		&#announcement-section {
			flex-direction: column;
		}
	}
`;

// const levelAutoCompletes

const marks = [...Array(7)].map((item, index) => ({ value: index / 2, label: `x${index / 2}` }));

interface general {
	channel: string;
	message: string;
	announcement: boolean;
}

interface banned {
	channels: string[];
	roles: string[];
}

interface scaling {
	general: number;
	roles?: { [id: string]: number };
}

interface settings {
	bannedItems: banned;
	general: general;
	scaling: scaling;
}

const defaultSettings = (): settings => ({
	bannedItems: {
		roles: [],
		channels: [],
	},
	general: {
		message: "Congrats {player}, you leveled up to level {level}!",
		channel: null,
		announcement: false,
	},
	scaling: {
		general: 1,
	},
});

const actions = {
	UPDATE: "update",
	RESET: "reset",
	SET: "set",
};

const settingsReducer = (state: settings, action: Action) => {
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
			return defaultSettings();
		case actions.SET:
			return action.value;
	}
};

const Leveling = () => {
	const router = useRouter();
	const [, serverId] = router.query.type as string[];

	const [state, dispatch] = useReducer<(state: settings, action: Action) => settings, settings>(
		settingsReducer,
		defaultSettings(),
		defaultSettings
	);

	const [defaultValues, setDefaultValues] = useState<settings>(() => defaultSettings());
	const { allChannels, roles, emotes } = useContext(discordContext);
	const [emotePickerOpen, setEmotePickerOpen] = useState(false);

	const smallScreen = useMediaQuery("(max-width: 725px)");

	const save = async () => {
		const collectionRef = firebaseClient.db
			.collection("Leveling")
			.doc(serverId)
			.collection("settings");
		if (!isEqual(state.bannedItems, defaultValues.bannedItems)) {
			await collectionRef.doc("bannedItems").set(state.bannedItems, { merge: true });
		}
		if (!isEqual(state.general, defaultValues.general)) {
			await collectionRef.doc("general").set(state.general, { merge: true });
		}
		if (!isEqual(state.scaling, defaultValues.scaling)) {
			await collectionRef.doc("scaling").set(state.scaling, { merge: true });
		}
		setDefaultValues(cloneDeep(state));
	};

	const reset = () => {
		dispatch({ type: actions.SET, value: cloneDeep(defaultValues) });
	};

	useEffect(() => {
		(async () => {
			try {
				const levelingRef = firebaseClient.db
					.collection("Leveling")
					.doc(serverId)
					.collection("settings");
				const levelingCollection = await levelingRef.get();

				let levelingDocs = levelingCollection.docs.reduce((acc, cur) => {
					acc[cur.id] = cur.data();
					return acc;
				}, {}) as settings;

				// these are where the values for the notification channel and message used to be stored
				// anyone who hasn't used the new site will still have them stored there so I fetch them just in case
				const legacyDoc = (
					await firebaseClient.db.collection("Leveling").doc(serverId).get()
				).data();

				const legacyMessage = legacyDoc.message;
				const legacyChannel = legacyDoc.notifications;
				const legacyAnnouncment = legacyDoc.type === 3;

				// replace any missing values in the settings with values from the primary settings while also checking the legacy values
				const levelSettings = ["bannedItems", "general", "scaling"].reduce((acc, key) => {
					let value = levelingDocs[key] ?? {};
					if (key === "general") {
						value.message = value.message ?? legacyMessage;
						value.channel = value.channel ?? legacyChannel;
						value.announcement = value.announcement ?? legacyAnnouncment;
					}
					acc[key] = { ...defaultSettings()[key], ...value };
					return acc;
				}, {}) as settings;

				// default values won't change and will be used to check if the over values have changed
				setDefaultValues(cloneDeep({ ...levelSettings }));

				dispatch({ type: actions.SET, value: cloneDeep({ ...levelSettings }) });
			} catch (err) {
				console.log(err.message);
			}
		})();
	}, [serverId, allChannels, roles]);

	const announcementChannel = allChannels.find(channel => channel.id === state.general.channel);

	const noXpRoles = state.bannedItems.roles.map(roleId => roles.find(role => role.id === roleId));
	const noXpChannels = state.bannedItems.channels.map(channelId =>
		allChannels.find(channel => channel.id === channelId)
	);

	const changed = !isEqual(defaultValues, state);

	return (
		<div>
			<PluginSubHeader>
				<span>
					<H2>Level up announcement</H2>
					<h4>
						Whenever a user gains a level, DisStreamBot can send a personalized message.
					</h4>
				</span>
				<Switch
					color="primary"
					checked={!!state.general.announcement}
					onChange={e =>
						dispatch({
							type: actions.UPDATE,
							key: "general.announcement",
							value: e.target.checked,
						})
					}
				/>
			</PluginSubHeader>
			<AnnouncementSection
				data-open={!!state.general.announcement}
				// @ts-ignore
				variants={levelingVariants}
				initial="initial"
				animate={!!state.general.announcement ? "open" : "closed"}
				id="announcement-section"
			>
				<div>
					<SubSectionTitle>Announcement Channel</SubSectionTitle>
					<Select
						onChange={value => {
							const channel = parseSelectValue(value);

							dispatch({
								type: actions.UPDATE,
								key: "general.channel",
								value: channel,
							});
						}}
						value={
							announcementChannel
								? {
										value: transformObjectToSelectValue(announcementChannel),
										label: <ChannelItem {...announcementChannel} />,
								  }
								: {}
						}
						options={allChannels.map(channel => ({
							value: transformObjectToSelectValue(channel),
							label: <ChannelItem {...channel} />,
						}))}
					/>
				</div>
				<div style={{ zIndex: 100 }}>
					<SubSectionTitle>Announcement Message</SubSectionTitle>
					<EmoteParent>
						<EmotePickerOpener onClick={() => setEmotePickerOpen(true)}>
							<img width="24" height="24" src="/smile.svg" alt="" />
						</EmotePickerOpener>
						<EmotePicker
							emotes={emotes}
							onClickAway={() => setEmotePickerOpen(false)}
							visible={emotePickerOpen}
							onEmoteSelect={emote => {
								dispatch({
									type: actions.UPDATE,
									key: "general.message",
									value: prev => `${prev} ${emote.colons}`,
								});
							}}
						/>
					</EmoteParent>
					<TextArea
						value={state.general.message}
						onChange={e =>
							dispatch({
								type: actions.UPDATE,
								key: "general.message",
								value: e.target.value,
							})
						}
						trigger={{
							"{": {
								dataProvider: token => {
									return allItems
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
							":": emoteAutoComplete(emotes)
						}}
					/>
				</div>
			</AnnouncementSection>
			<hr />
			<PluginSubHeader>
				<span>
					<H2>Server Xp rate</H2>
					<h4>Change the rate at which all members of the server gain XP.</h4>
				</span>
			</PluginSubHeader>
			<PluginSection>
				<PrettoSlider
					value={state.scaling.general}
					onChange={(e, value) => {
						if (Array.isArray(value)) {
							dispatch({
								type: actions.UPDATE,
								key: "scaling.general",
								value: value[0],
							});
						} else {
							dispatch({ type: actions.UPDATE, key: "scaling.general", value });
						}
					}}
					defaultValue={1}
					getAriaValueText={value => `${value}xp`}
					aria-labelledby="xp scaling"
					valueLabelDisplay="auto"
					step={0.5}
					min={0}
					max={3}
					marks={marks}
				/>
			</PluginSection>
			<hr />

			<PluginSubHeader>
				<span>
					<H2>No-XP Roles</H2>
					<h4>You can set roles here that will stop users from gaining XP.</h4>
				</span>
			</PluginSubHeader>
			<PluginSection>
				<MultiSelect
					onChange={value => {
						const roleId = parseSelectValue(value);
						const role = roles.find(role => role.id === roleId);
						dispatch({
							type: actions.UPDATE,
							key: "bannedItems.roles",
							value: prev => [...prev, roleId],
						});
					}}
					value={noXpRoles.map(role => ({
						value: transformObjectToSelectValue(role),
						label: (
							<RoleItem
								{...role}
								onClick={id =>
									dispatch({
										type: actions.UPDATE,
										key: "bannedItems.roles",
										value: prev => prev.filter(role => role.id !== id),
									})
								}
							/>
						),
					}))}
					options={roles.map(role => ({
						value: transformObjectToSelectValue(role),
						label: <RoleOption {...role}>{role.name}</RoleOption>,
					}))}
				></MultiSelect>
			</PluginSection>
			<hr />
			<PluginSubHeader>
				<span>
					<H2>No-XP Channels</H2>
					<h4>
						You can also prevent your members from gaining XP if they send messages in
						certain text channels.
					</h4>
				</span>
			</PluginSubHeader>
			<PluginSection>
				<MultiSelect
					onChange={value => {
						const channelId = parseSelectValue(value);
						const channel = allChannels.find(channel => channel.id === channelId);
						dispatch({
							type: actions.UPDATE,
							key: "bannedItems.channels",
							value: prev => [...prev, channelId],
						});
					}}
					value={noXpChannels.map(channel => ({
						value: transformObjectToSelectValue(channel),
						label: (
							<ChannelOption
								{...channel}
								color="#ffffffa0"
								onClick={id =>
									dispatch({
										type: actions.UPDATE,
										key: "bannedItems.channels",
										value: prev => prev.filter(channel => channel.id !== id),
									})
								}
							/>
						),
					}))}
					options={allChannels.map(channel => ({
						value: transformObjectToSelectValue(channel),
						label: <ChannelItem {...channel} color="#ffffffa0" />,
					}))}
				></MultiSelect>
			</PluginSection>
			<hr />
			<SaveBar changed={changed} save={save} reset={reset} />
		</div>
	);
};

export default Leveling;
