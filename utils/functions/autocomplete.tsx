import React from "react";
import { ChannelItem } from "../../components/dashboard/Discord/ChannelItem";

export const channelAutoComplete = allChannels => ({
	dataProvider: token => {
		return allChannels
			.filter(channel => channel.name.includes(token))
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
