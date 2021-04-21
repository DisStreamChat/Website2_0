import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useMemo } from "react";
import { ClickAwayListener } from "@material-ui/core";
import styled from "styled-components";

interface EmotePickerProps {
	emotes: any[];
	visible?: boolean;
	onClickAway?: () => void;
	onEmoteSelect: (emote: any) => void;
	top?: string;
	left?: string;
	right?: string;
	bottom?: string;
}

export const EmotePicker = ({
	emotes,
	visible,
	onClickAway,
	onEmoteSelect,
	...props
}: EmotePickerProps) => {
	const customEmojis = useMemo(() => {
		return emotes
			.map(emote => ({
				id: emote.id,
				name: emote.name,
				text: "",
				short_names: [emote.name],
				customCategory: "Discord",
				native: emote.name,
				emoticons: [],
				keywords: ["discord", emote.name],
				imageUrl: emote.url,
			}))
			.sort(emote => (emote.customCategory === "Twitch" ? 1 : -1));
	}, [emotes]);

	console.log({customEmojis})

	return visible ? (
		<ClickAwayListener onClickAway={onClickAway}>
			<Picker
				emojiSize={28}
				custom={customEmojis}
				theme="dark"
				include={[]}
				style={{
					position: "absolute",
					top: props.top ?? ".5rem",
					right: props.top ?? ".5rem",
					bottom: props.bottom,
					left: props.left,
					zIndex: 100,
				}}
				set="twitter"
				title="Pick your emote…"
				emoji="point_up"
				onSelect={onEmoteSelect}
			/>
		</ClickAwayListener>
	) : (
		<></>
	);
};

export const EmoteParent = styled.div`
	position: relative;
`;

export const EmotePickerOpener = styled.div`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: none;
	outline: none;
	border: none;
	z-index: 80;
	cursor: pointer;
`;
