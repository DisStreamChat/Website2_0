import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useMemo } from "react";
import { ClickAwayListener } from "@material-ui/core";

interface EmotePickerProps {
	emotes: any[];
	visible?: boolean;
	onClickAway?: () => void;
	onEmoteSelect: (emote: any) => void;
}

export const EmotePicker = ({ emotes, visible, onClickAway, onEmoteSelect }: EmotePickerProps) => {
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

	return visible ? (
		<ClickAwayListener onClickAway={onClickAway}>
			<Picker
				emojiSize={28}
				custom={customEmojis}
				theme="dark"
				include={[]}
				style={{ position: "absolute", top: ".5rem", right: ".5rem", zIndex: 100 }}
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
