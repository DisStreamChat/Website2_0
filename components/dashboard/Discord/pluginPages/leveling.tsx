import { Switch } from "@material-ui/core";
import React, { useState, useContext } from "react";
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

const levelingVariants = {
	initial: {
		height: "0px",
		opacity: 0,
	},
	open: {
		height: "180px",
		opacity: 1,
	},
	closed: {
		opacity: 0,
		height: "-5px",
	},
};

const AnnouncementSection = styled(PluginSection)`
	display: flex;
	& > div {
		flex: 1 1 45%;
	}
`;

const marks = [...Array(7)].map((item, index) => ({ value: index / 2, label: `x${index / 2}` }));

const Leveling = () => {
	const [levelupAnnouncement, setLevelupAnnouncement] = useState(false);

	const [announcementChannel, setAnnouncementChannel] = useState(false);
	const [noXpRoles, setNoXpRoles] = useState([]);
	const [noXpChannels, setNoXpChannels] = useState([]);
	const [generalScaling, setGeneralScaling] = useState(1);
	const [levelUpMessage, setLevelUpMessage] = useState(
		"Congrats {player}, you leveled up to level {level}!"
	);

	const { allChannels, roles } = useContext(discordContext);

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
			>
				<div>
					<SubSectionTitle>Announcement Channel</SubSectionTitle>
					<Select
						options={allChannels.map(channel => ({
							value: transformObjectToSelectValue(channel),
							label: <ChannelItem {...channel} />,
						}))}
					/>
				</div>
				<div>
					<SubSectionTitle>Announcement Message</SubSectionTitle>
					<TextArea value={levelUpMessage} />
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
