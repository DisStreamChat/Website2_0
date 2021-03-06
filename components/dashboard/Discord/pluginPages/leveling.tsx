import { Switch, useMediaQuery } from "@material-ui/core";
import React, { useState, useContext, useEffect } from "react";
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
import { channelAutoComplete } from "../../../../utils/functions/autocomplete";

interface levelSettings {
	bannedItems: {
		channels: string[];
		roles: string[];
	};
	general: {
		message: string;
		channel: string | null;
	};
	scaling: {
		general: number;
		roles?: {
			[serverId: string]: number;
		};
	};
}

const primaryLevelSettings: levelSettings = {
	bannedItems: {
		channels: [],
		roles: [],
	},
	general: {
		message: "Congrats {player}, you leveled up to level {level}!",
		channel: null,
	},
	scaling: {
		general: 1,
	},
};

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
	@media screen and (max-width: 725px){
		&#announcement-section{
			flex-direction: column;
		}
	}
`;

// const levelAutoCompletes

const marks = [...Array(7)].map((item, index) => ({ value: index / 2, label: `x${index / 2}` }));

const Leveling = () => {
	const router = useRouter();
	const [, serverId] = router.query.type as string[];

	const [levelupAnnouncement, setLevelupAnnouncement] = useState(false);

	const [announcementChannel, setAnnouncementChannel] = useState<any>();
	const [noXpRoles, setNoXpRoles] = useState([]);
	const [noXpChannels, setNoXpChannels] = useState([]);
	const [generalScaling, setGeneralScaling] = useState(1);
	const [levelUpMessage, setLevelUpMessage] = useState(
		"Congrats {player}, you leveled up to level {level}!"
	);
	const [defaultValues, setDefaultValues] = useState({});
	const { allChannels, roles } = useContext(discordContext);

	const smallScreen = useMediaQuery("(max-width: 725px)")

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
				}, {}) as levelSettings;

				// these are where the values for the notification channel and message used to be stored
				// anyone who hasn't used the new site will still have them stored there so I fetch them just in case
				const legacyMessage = (
					await firebaseClient.db.collection("Leveling").doc(serverId).get()
				).data().message;

				const legacyChannel = (
					await firebaseClient.db.collection("Leveling").doc(serverId).get()
				).data().notifications;

				// replace any missing values in the settings with values from the primary settings while also checking the legacy values
				levelingDocs = ["bannedItems", "general", "scaling"].reduce((acc, key) => {
					let value = levelingDocs[key] ?? {};
					if (key === "general") {
						value.message = value.message ?? legacyMessage;
						value.channel = value.channel ?? legacyChannel;
					}
					acc[key] = { ...primaryLevelSettings[key], ...value };
					return acc;
				}, {}) as levelSettings;

				// default values won't change and will be used to check if the over values have changed
				setDefaultValues(levelingDocs);

				setLevelUpMessage(levelingDocs?.general?.message);
				setAnnouncementChannel(
					allChannels.find(channel => channel.id === levelingDocs?.general?.channel)
				);

				if (levelingDocs.bannedItems) {
					setNoXpChannels(
						levelingDocs.bannedItems.channels
							?.map?.(id => allChannels.find(channel => channel.id === id))
							.filter(Boolean)
					);
					setNoXpRoles(
						levelingDocs.bannedItems.roles
							?.map?.(id => roles.find(role => role.id === id))
							.filter(Boolean)
					);
				}
			} catch (err) {
				console.log(err.message);
			}
		})();
	}, [serverId, allChannels, roles]);

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
					value={levelupAnnouncement}
					onChange={e => setLevelupAnnouncement(e.target.checked)}
				/>
			</PluginSubHeader>
			<AnnouncementSection
				data-open={levelupAnnouncement}
				// @ts-ignore
				variants={levelingVariants}
				initial="initial"
				animate={levelupAnnouncement ? "open" : "closed"}
				id="announcement-section"
			>
				<div >
					<SubSectionTitle>Announcement Channel</SubSectionTitle>
					<Select
						onChange={value => {
							const channel = parseSelectValue(value);

							setAnnouncementChannel(allChannels.find(({ id }) => id === channel));
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
				<div style={{zIndex: 100}}>
					<SubSectionTitle>Announcement Message</SubSectionTitle>
					<TextArea
						value={levelUpMessage}
						onChange={e => setLevelUpMessage(e.target.value)}
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
									<div className={`text-area-item ${selected ? "selected" : ""}`}>{name}</div>
								),
								output: (item, trigger) => item.char,
							},
							"#": channelAutoComplete(allChannels),
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
					value={generalScaling}
					onChange={(e, value) => {
						if (Array.isArray(value)) {
							setGeneralScaling(value[0]);
						} else {
							setGeneralScaling(value);
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
						setNoXpRoles(prev => [...prev, role]);
					}}
					value={noXpRoles.map(role => ({
						value: transformObjectToSelectValue(role),
						label: (
							<RoleItem
								{...role}
								onClick={id =>
									setNoXpRoles(prev => prev.filter(role => role.id !== id))
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
						setNoXpChannels(prev => [...prev, channel]);
					}}
					value={noXpChannels.map(channel => ({
						value: transformObjectToSelectValue(channel),
						label: (
							<ChannelOption
								{...channel}
								color="#ffffffa0"
								onClick={id =>
									setNoXpChannels(prev =>
										prev.filter(channel => channel.id !== id)
									)
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
		</div>
	);
};

export default Leveling;
