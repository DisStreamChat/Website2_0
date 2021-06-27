import { MessageEmbedOptions } from "discord.js";
import React from "react";
import {
    EmbedEditorBody,
    EmbedHalf,
    EmbedSection,
    EmbedSectionTitle,
    FlexSection,
    ImageUpload,
} from "./EmbedEditor.style";
import { CirclePicker, ChromePicker } from "react-color";
import { roleColors } from "../../header/rankCardModal";
import InsertPhotoTwoToneIcon from "@material-ui/icons/InsertPhotoTwoTone";
import { TextArea, TextInput } from "../../shared/ui-components/TextField";
export interface EmbedOptions extends Omit<MessageEmbedOptions, "color"> {
    color: string;
}

export const defaultEmbedGenerator = (description?: string): EmbedOptions => {
    return {
        color: "#3498db",
        title: null,
        url: null,
        timestamp: 0,
        fields: [],
        files: [],
        description,
        author: {
            name: null,
            url: null,
            iconURL: null,
            proxyIconURL: null,
        },
        thumbnail: {
            url: null,
            proxyURL: null,
            height: null,
            width: null,
        },
        image: {
            url: null,
            proxyURL: null,
            height: null,
            width: null,
        },
        footer: {
            text: null,
            iconURL: null,
            proxyIconURL: null,
        },
    };
};

interface EmbedEditorProps {
    value: EmbedOptions;
    onChange?: (value: EmbedOptions) => void;
}

export const EmbedEditor = ({ value, onChange }: EmbedEditorProps) => {
    return (
        <EmbedEditorBody color={value.color}>
            <EmbedHalf>
                <EmbedSection>
                    <EmbedSectionTitle>Color</EmbedSectionTitle>
                    <CirclePicker
                        colors={roleColors}
                        circleSize={16}
                        circleSpacing={8}
                        onChange={(color) => {
                            if (!onChange) return;
                            onChange({ ...value, color: color.hex });
                        }}
                    ></CirclePicker>
                </EmbedSection>
                <EmbedSection>
                    <EmbedSectionTitle>Author</EmbedSectionTitle>
                    <FlexSection>
                        <ImageUpload onChange={(url) => {}} />
                        <TextInput
                            value={value.author.name}
                            onChange={(event) => {
                                if (!onChange) return;
                                const copy = { ...value };
                                copy.author.name = event.target.value;
                                onChange(copy);
                            }}
                            placeholder="Author Name"
                            type="text"
                            name="name"
                        />
                    </FlexSection>
                </EmbedSection>
                <EmbedSection>
                    <EmbedSectionTitle>Title Text</EmbedSectionTitle>
                    <TextInput
                        value={value.title}
                        placeholder="Title Text"
                        type="text"
                        name="name"
                        onChange={(event) => {
                            if (!onChange) return;
                            const copy = { ...value };
                            copy.title = event.target.value;
                            onChange(copy);
                        }}
                    />
                </EmbedSection>
                <EmbedSection>
                    <EmbedSectionTitle>Message Content</EmbedSectionTitle>
                    <TextArea
                        trigger={{}}
                        value={value.description}
                        placeholder="Message Content"
                        type="text"
                        name="name"
                        onChange={(event) => {
                            if (!onChange) return;
                            const copy = { ...value };
                            copy.description = event.target.value;
                            onChange(copy);
                        }}
                    />
                </EmbedSection>
                <EmbedSection>
                    <EmbedSectionTitle>Additional fields</EmbedSectionTitle>
                </EmbedSection>
                <EmbedSection>
                    <ImageUpload
                        large
                        onChange={(url) => {
                            if (!onChange) return;
                            const copy = { ...value };
                            copy.image.url = url;
                            onChange(copy);
                        }}
                    />
                </EmbedSection>
                <EmbedSection>
                    <EmbedSectionTitle>Footer</EmbedSectionTitle>
                    <FlexSection>
                        <ImageUpload
                            onChange={(url) => {
                                if(!onChange) return;
								const copy = { ...value };
                                copy.footer = {
                                    ...copy.footer,
                                    iconURL: url,
                                    icon_url: url,
                                };
								onChange(copy);
                            }}
                        />
                        <TextInput
                            value={value.author.name}
                            onChange={(event) => {
                                if (!onChange) return;
                                const copy = { ...value };
                                copy.footer.text = event.target.value;
                                onChange(copy);
                            }}
                            placeholder="Footer Text"
                            type="text"
                            name="name"
                        />
                    </FlexSection>
                </EmbedSection>
            </EmbedHalf>
            <EmbedHalf>
                <ImageUpload
                    large
                    onChange={(url) => {
                        if (!onChange) return;
                        const copy = { ...value };
                        copy.thumbnail.url = url;
                        onChange(copy);
                    }}
                />
            </EmbedHalf>
        </EmbedEditorBody>
    );
};
