import React from "react";
import { ChannelItem } from "../../components/dashboard/Discord/ChannelItem";
import RoleItem from "../../components/dashboard/Discord/RoleItem";

export const channelAutoComplete = allChannels => ({
	dataProvider: token => {
		return allChannels
			.filter(channel => channel.name.toLowerCase().includes(token.toLowerCase()))
			.map(channel => ({
				...channel,
				name: `${channel.name}`,
				char: `<#${channel.id}>`,
			}));
	},
	component: ({ selected, entity }) => (
		<div className={`text-area-item ${selected ? "selected" : ""}`}>
			<ChannelItem {...entity} />
		</div>
	),
	output: (item, trigger) => item.char,
});

export const roleAutoComplete = roles => ({
	dataProvider: token => {
		return roles
			.filter(role => role.name.toLowerCase().includes(token.toLowerCase()))
			.map(role => ({
				...role,
				name: `${role.name}`,
				char: `<@&${role.id}>`,
			}));
	},
	component: ({ selected, entity }) => (
		<div className={`text-area-item ${selected ? "selected" : ""}`}>
			<RoleItem {...entity} />
		</div>
	),
	output: (item, trigger) => item.char,
});

export const emoteAutoComplete = emotes => ({
	dataProvider: token => {
		return emotes
			.filter(emote => emote.name.toLowerCase().includes(token.toLowerCase()))
			.map(emote => ({
				...emote,
				name: `${emote.name}`,
				char: `:${emote.name}:`,
			}));
	},
	component: ({ selected, entity }) => (
		<div className={`text-area-item ${selected ? "selected" : ""}`}>
			<img src={entity.url} width="24" height="24"/>
		</div>
	),
	output: (item, trigger) => item.char,
})

export const levelItems = ["level", "xp"];

export const generalItems = ["player", "user", "user.tag", "member", "user.username"];

export const allItems = [...levelItems, ...generalItems];
