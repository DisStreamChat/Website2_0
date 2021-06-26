import { AnimatePresence, motion } from "framer-motion";
import { cloneDeep, get, isEqual, set } from "lodash";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { ChromePicker, CirclePicker } from "react-color";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";

import { ClickAwayListener, Switch, Tooltip } from "@material-ui/core";
import ColorizeIcon from "@material-ui/icons/Colorize";

import firebaseClient from "../../../../firebase/client";
import {
    parseSelectValue,
    transformObjectToSelectValue,
} from "../../../../utils/functions";
import {
    channelAutoComplete,
    emoteAutoComplete,
    generalItems,
    roleAutoComplete,
} from "../../../../utils/functions/autocomplete";
import { Action } from "../../../../utils/types";
import {
    ColorPickerBlock,
    ColorPickers,
    roleColors,
} from "../../../header/rankCardModal";
import { SectionTitle } from "../../../shared/styles/plugins";
import {
    EmoteParent,
    EmotePicker,
    EmotePickerOpener,
} from "../../../shared/ui-components/emotePicker";
import SaveBar from "../../../shared/ui-components/SaveBar";
import Select from "../../../shared/ui-components/Select";
import { TextArea } from "../../../shared/ui-components/TextField";
import { ChannelItem } from "../ChannelItem";
import { discordContext } from "../discordContext";

const actions = {
    UPDATE: "update",
    SET: "set",
    CLEAR: "clear",
    RESET: "clear",
};

interface WelcomeImage {
    backgroundColor: string;
    borderColor: string;
    backgroundImage?: string;
}

interface welcomeMessage {
    channel: string;
    message: string;
    hasWelcomeImage: boolean;
    welcomeImage?: WelcomeImage;
    type?: string;
}

const defaultWelcomeMessage = (): welcomeMessage => {
    return {
        type: "",
        channel: "",
        message: "Welcome to {server}, {member}",
        hasWelcomeImage: false,
        welcomeImage: {
            backgroundColor: "##7ed6df",
            borderColor: "#eb4d4b",
            backgroundImage: null,
        },
    };
};

const welcomeReducer = (state: welcomeMessage, action: Action) => {
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
        case actions.SET:
            return action.value;
        case actions.RESET:
        case actions.CLEAR:
            return defaultWelcomeMessage();
    }
};

const WelcomeArea = styled.div`
    & + * {
        margin-top: 1rem;
    }
    &.top {
        &,
        & * {
            z-index: 1000;
        }
    }
    textarea,
    .text-area-list {
        /* max-width: 80%; */
    }
    /* display: flex; */
`;

const WelcomeContainer = styled.div`
    padding-bottom: 3rem;
`;

const WelcomeImageContainer = styled(motion.div)`
    overflow: hidden;
    display: flex;
    gap: 0.5rem;
`;

const WelcomeImageSettings = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
	gap: .5rem;
	padding: .5rem;
`;

const Welcome = () => {
    const router = useRouter();
    const [, serverId, pluginName] = router.query.type as string[];
    const docRef = firebaseClient.db
        .collection("DiscordSettings")
        .doc(serverId);
    const [snapshot, loading, error] = useDocumentData(docRef);
    const { allChannels, emotes, roles, isPremium } =
        useContext(discordContext);
    const [emotePickerOpen, setEmotePickerOpen] = useState(false);
    const [backgroundPickerOpen, setBackgroundPickerOpen] = useState(false);
    const [borderPickerOpen, setBorderPickerOpen] = useState(false);

    const databaseWelcomeMessage = snapshot?.welcomeMessage;

    const [state, dispatch] = useReducer<
        (state: welcomeMessage, action: Action) => welcomeMessage,
        welcomeMessage
    >(welcomeReducer, defaultWelcomeMessage(), defaultWelcomeMessage);

    useEffect(() => {
        if (databaseWelcomeMessage) {
            dispatch({ type: actions.SET, value: cloneDeep(databaseWelcomeMessage) });
        }
    }, [databaseWelcomeMessage]);

    const welcomeChannel = allChannels.find(
        (channel) => channel.id === state.channel
    );

    const changed = !isEqual(
        databaseWelcomeMessage ?? defaultWelcomeMessage(),
        state
    );

    const save = () => {
        docRef.set({ welcomeMessage: state }, { merge: true });
    };

    const reset = () => {
        dispatch({ type: actions.SET, value: databaseWelcomeMessage });
    };

    const { backgroundColor, borderColor } = state.welcomeImage || {};

    const updateBackgroundColor = (color: { hex: string }) => {
        dispatch({
            type: actions.UPDATE,
            value: color.hex,
            key: "welcomeImage.backgroundColor",
        });
    };

    const updateBorderColor = (color: { hex: string }) => {
        dispatch({
            type: actions.UPDATE,
            value: color.hex,
            key: "welcomeImage.borderColor",
        });
    };

    return (
        <WelcomeContainer>
            <div>
                <WelcomeArea className="top">
                    <SectionTitle>Welcome Channel</SectionTitle>
                    <Select
                        placeholder="Select a channel"
                        onChange={(value) => {
                            const channel = parseSelectValue(value);
                            dispatch({
                                type: "update",
                                key: "channel",
                                value: channel,
                            });
                        }}
                        value={
                            welcomeChannel
                                ? {
                                      value: transformObjectToSelectValue(
                                          welcomeChannel
                                      ),
                                      label: (
                                          <ChannelItem {...welcomeChannel} />
                                      ),
                                  }
                                : null
                        }
                        options={allChannels.map((channel) => ({
                            value: transformObjectToSelectValue(channel),
                            label: <ChannelItem {...channel} />,
                        }))}
                    />
                </WelcomeArea>
                <WelcomeArea>
                    <SectionTitle>Welcome Message</SectionTitle>
                    <EmoteParent style={{ maxWidth: "80%" }}>
                        <EmotePickerOpener
                            onClick={() => setEmotePickerOpen(true)}
                        >
                            <img
                                width="24"
                                height="24"
                                src="/smile.svg"
                                alt=""
                            />
                        </EmotePickerOpener>
                        <EmotePicker
                            onEmoteSelect={(emote) => {
                                const emoteText = emote.imageUrl
                                    ? `<${emote.colons}${emote.imageUrl
                                          .split("/")
                                          .slice(-1)[0]
                                          .slice(0, -4)}>`
                                    : emote.colons;

                                dispatch({
                                    type: actions.UPDATE,
                                    key: "message",
                                    value: (prev) => `${prev} ${emoteText}`,
                                });
                            }}
                            visible={emotePickerOpen}
                            emotes={emotes}
                            onClickAway={() => setEmotePickerOpen(false)}
                        />
                        <TextArea
                            value={state.message}
                            onChange={(e) =>
                                dispatch({
                                    type: actions.UPDATE,
                                    key: "message",
                                    value: e.target.value,
                                })
                            }
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
                        ></TextArea>
                    </EmoteParent>
                </WelcomeArea>
                <SaveBar changed={changed} save={save} reset={reset} />
            </div>
            {isPremium && (
                <div>
                    <WelcomeArea>
                        <SectionTitle>
                            <Switch
                                checked={state.hasWelcomeImage}
                                onChange={(e) =>
                                    dispatch({
                                        type: actions.UPDATE,
                                        value: e.target.checked,
                                        key: "hasWelcomeImage",
                                    })
                                }
                                color="primary"
                                name="checkedB"
                            />{" "}
                            Welcome Image
                        </SectionTitle>
                        <AnimatePresence>
                            {state.hasWelcomeImage && (
                                <WelcomeImageContainer
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                >
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="700px"
                                        height="400px"
                                    >
                                        <defs>
                                            <pattern
                                                id="bgImage"
                                                patternUnits="userSpaceOnUse"
                                                width="700"
                                                height="400"
                                            >
                                                <image
                                                    href="${customizationData.backgroundImage}"
                                                    x="0"
                                                    y="0"
                                                    width="700"
                                                    height="400"
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            id="rect"
                                            width="100%"
                                            height="100%"
                                            rx="25px"
                                            ry="25px"
                                            style={{ fill: backgroundColor }}
                                        ></rect>
                                        <rect
                                            id="rect"
                                            width="100%"
                                            height="100%"
                                            rx="25px"
                                            ry="25px"
                                            style={{ fill: backgroundColor }}
                                        ></rect>
                                        <circle
                                            r="90"
                                            cx="50%"
                                            cy="35%"
                                            style={{ fill: borderColor }}
                                        ></circle>
                                        <clipPath id="clipCircle">
                                            <circle
                                                r="83"
                                                cx="50%"
                                                cy="35%"
                                            ></circle>
                                        </clipPath>
                                        <image
                                            x="260"
                                            y="50"
                                            width="180"
                                            height="180"
                                            clip-path="url(#clipCircle)"
                                            href="https://cdn.discordapp.com/avatars/193826355266191372/49769d1ba6b5e5da6d9f6e0582afab99.png"
                                        ></image>
                                        <text
                                            dominant-baseline="middle"
                                            text-anchor="middle"
                                            x="50%"
                                            y="272"
                                            font-family="Poppins"
                                            font-size="48"
                                            font-weight="800"
                                            text-align="center"
                                        >
                                            <tspan fill="white">WELCOME</tspan>
                                        </text>
                                        <text
                                            dominant-baseline="middle"
                                            text-anchor="middle"
                                            x="50%"
                                            y="315"
                                            font-family="Poppins"
                                            font-size="48"
                                            font-weight="800"
                                            text-align="center"
                                        >
                                            <tspan fill="white">
                                                David#1000
                                            </tspan>
                                        </text>
                                        <text
                                            dominant-baseline="middle"
                                            text-anchor="middle"
                                            x="50%"
                                            y="355"
                                            font-family="Poppins"
                                            font-size="24"
                                            font-weight="800"
                                            text-align="center"
                                        >
                                            <tspan fill="white">
                                                YOU ARE OUR 100TH MEMBER!
                                            </tspan>
                                        </text>
                                    </svg>
                                    <WelcomeImageSettings>
                                        <ColorPickers>
                                            <Tooltip title="Default">
                                                <ColorPickerBlock
                                                    color={"#992d22"}
                                                />
                                            </Tooltip>
                                            <ColorPickerBlock
                                                onClick={() => {
                                                    setBackgroundPickerOpen(
                                                        true
                                                    );
                                                }}
                                                color={
                                                    roleColors.includes(
                                                        backgroundColor
                                                    )
                                                        ? null
                                                        : backgroundColor
                                                }
                                            >
                                                <ColorizeIcon></ColorizeIcon>
                                                {backgroundPickerOpen && (
                                                    <ClickAwayListener
                                                        onClickAway={() => {
                                                            setBackgroundPickerOpen(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <ChromePicker
                                                            disableAlpha
                                                            color={
                                                                backgroundColor
                                                            }
                                                            onChange={
                                                                updateBackgroundColor
                                                            }
                                                        />
                                                    </ClickAwayListener>
                                                )}
                                            </ColorPickerBlock>
                                            <CirclePicker
                                                width="380px"
                                                color={backgroundColor}
                                                colors={roleColors}
                                                onChange={updateBackgroundColor}
                                            />
                                        </ColorPickers>
                                        <ColorPickers>
                                            <Tooltip title="Default">
                                                <ColorPickerBlock
                                                    color={"#992d22"}
                                                />
                                            </Tooltip>
                                            <ColorPickerBlock
                                                onClick={() => {
                                                    setBorderPickerOpen(true);
                                                }}
                                                color={
                                                    roleColors.includes(
                                                        borderColor
                                                    )
                                                        ? null
                                                        : borderColor
                                                }
                                            >
                                                <ColorizeIcon></ColorizeIcon>
                                                {borderPickerOpen && (
                                                    <ClickAwayListener
                                                        onClickAway={() => {
                                                            setBorderPickerOpen(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <ChromePicker
                                                            disableAlpha
                                                            color={borderColor}
                                                            onChange={
                                                                updateBorderColor
                                                            }
                                                        />
                                                    </ClickAwayListener>
                                                )}
                                            </ColorPickerBlock>
                                            <CirclePicker
                                                width="380px"
                                                color={borderColor}
                                                colors={roleColors}
                                                onChange={updateBorderColor}
                                            />
                                        </ColorPickers>
                                    </WelcomeImageSettings>
                                </WelcomeImageContainer>
                            )}
                        </AnimatePresence>
                    </WelcomeArea>
                </div>
            )}
        </WelcomeContainer>
    );
};

export default Welcome;
