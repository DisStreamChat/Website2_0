import { MessageEmbedOptions } from "discord.js";
import React from "react";
import { EmbedEditorBody } from "./EmbedEditor.style";

interface EmbedOptions extends Omit<MessageEmbedOptions, "color"> {
	color: string;
}

interface EmbedEditorProps {
    value: EmbedOptions;
    onChange: (value: MessageEmbedOptions) => void;
}

export const EmbedEditor = ({ value, onChange }: EmbedEditorProps) => {
    return <EmbedEditorBody color={value.color}></EmbedEditorBody>;
};
