import { EmbedFieldData, MessageEmbedOptions } from 'discord.js';
import React, { useContext, useState } from 'react';
import { CirclePicker } from 'react-color';

import { Switch } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import {
    channelAutoComplete, emoteAutoComplete, generalItems, roleAutoComplete
} from '../../../utils/functions/autocomplete';
import { roleColors } from '../../header/rankCardModal';
import { EmptyButton } from '../../shared/ui-components/Button';
import { TextArea, TextInput } from '../../shared/ui-components/TextField';
import { discordContext } from './discordContext';
import {
    AddFieldSection, EmbedEditorBody, EmbedHalf, EmbedSection, EmbedSectionTitle, FieldContainer,
    FlexSection, ImageUpload
} from './EmbedEditor.style';

export interface EmbedOptions extends Omit<MessageEmbedOptions, "color"> {
    color: string;
}

export const defaultEmbedGenerator = (description?: string): EmbedOptions => {
    return {
        color: "#3498db",
        title: null,
        url: null,
        timestamp: 0,
        fields: [{ name: "", value: "", inline: false }],
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
    const { roles, allChannels, emotes } = useContext(discordContext);
    const [tempField, setTempField] = useState<EmbedFieldData>({
        name: "",
        value: "",
        inline: false,
    });
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
                        <ImageUpload
                            onChange={(url) => {
                                if (!onChange) return;
                                const copy = { ...value };
                                copy.author.icon_url = url;
                                copy.author.iconURL = url;
                                copy.author.proxyIconURL = url;
                                copy.author.proxy_icon_url = url;
                                onChange(copy);
                            }}
                        />
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
                        trigger={{
                            "{": {
                                dataProvider: (token) => {
                                    return generalItems
                                        .filter((chatter) =>
                                            chatter.includes(token)
                                        )
                                        .map((chatter) => ({
                                            name: `${chatter}`,
                                            char: `{${chatter}}`,
                                        }));
                                },
                                component: ({
                                    selected,
                                    entity: { name, char },
                                }) => (
                                    <div
                                        className={`text-area-item ${
                                            selected ? "selected" : ""
                                        }`}
                                    >
                                        {name}
                                    </div>
                                ),
                                output: (item, trigger) => item.char,
                            },
                            "#": channelAutoComplete(allChannels),
                            "@": roleAutoComplete(roles),
                            ":": emoteAutoComplete(emotes),
                        }}
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
                    <div>
                        {value.fields.map((field, i) => (
                            <FieldContainer inline={field.inline}>
                                <TextInput
                                    placeholder="Field Name"
                                    value={field.name}
                                    onChange={(e) => {
                                        if (!onChange) return;
                                        const copy = { ...value };
                                        copy.fields[i].name = e.target.value;
                                        onChange(copy);
                                    }}
                                />
                                <TextInput
                                    placeholder="Field Value"
                                    value={field.value}
                                    onChange={(e) => {
                                        if (!onChange) return;
                                        const copy = { ...value };
                                        copy.fields[i].value = e.target.value;
                                        onChange(copy);
                                    }}
                                />
                                <AddFieldSection>
                                    <FlexSection>
                                        <div>inline</div>
                                        <Switch
                                            checked={field.inline}
                                            onChange={(e) => {
                                                if (!onChange) return;
                                                const copy = { ...value };
                                                copy.fields[i].inline =
                                                    e.target.checked;
                                                onChange(copy);
                                            }}
                                        />
                                    </FlexSection>
                                    <FlexSection>
                                        <EmptyButton
                                            style={{ color: "#e74c3c" }}
                                            onClick={() => {
                                                if (!onChange) return;
                                                const copy = { ...value };
                                                copy.fields.splice(i, 1);
                                                onChange(copy);
                                            }}
                                        >
                                            <ClearIcon />
                                        </EmptyButton>
                                    </FlexSection>
                                </AddFieldSection>
                            </FieldContainer>
                        ))}
                        {tempField && (
                            <FieldContainer inline={tempField.inline}>
                                <TextInput
                                    placeholder="Field Name"
                                    value={tempField.name}
                                    onChange={(e) =>
                                        setTempField((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                                <TextInput
                                    placeholder="Field Value"
                                    value={tempField.value}
                                    onChange={(e) =>
                                        setTempField((prev) => ({
                                            ...prev,
                                            value: e.target.value,
                                        }))
                                    }
                                />
                                <AddFieldSection>
                                    <FlexSection>
                                        <div>inline</div>
                                        <Switch
                                            checked={tempField.inline}
                                            onChange={(e) =>
                                                setTempField((prev) => ({
                                                    ...prev,
                                                    inline: e.target.checked,
                                                }))
                                            }
                                        />
                                    </FlexSection>
                                    <FlexSection>
                                        <EmptyButton
                                            style={{ color: "#2ecc71" }}
                                            onClick={() => {
                                                if (
                                                    tempField.name.length ===
                                                        0 ||
                                                    tempField.value.length === 0
                                                )
                                                    return;
                                                const copy = { ...value };
                                                copy.fields.push({
                                                    ...tempField,
                                                });
                                                onChange?.(copy);
                                                setTempField({
                                                    name: "",
                                                    value: "",
                                                    inline: false,
                                                });
                                            }}
                                        >
                                            <CheckIcon />
                                        </EmptyButton>
                                        <EmptyButton
                                            style={{ color: "#e74c3c" }}
                                            onClick={() => {
                                                setTempField({
                                                    name: "",
                                                    value: "",
                                                    inline: false,
                                                });
                                                setTempField({
                                                    name: "",
                                                    value: "",
                                                    inline: false,
                                                });
                                            }}
                                        >
                                            <ClearIcon />
                                        </EmptyButton>
                                    </FlexSection>
                                </AddFieldSection>
                            </FieldContainer>
                        )}
                    </div>
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
                                if (!onChange) return;
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
                            value={value.footer.text}
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
