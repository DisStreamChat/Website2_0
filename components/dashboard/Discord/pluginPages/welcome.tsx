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
    ImageContainer,
    Images,
    roleColors,
} from "../../../header/rankCardModal";
import { SectionTitle } from "../../../shared/styles/plugins";
import {
    EmoteParent,
    EmotePicker,
    EmotePickerOpener,
} from "../../../shared/ui-components/emotePicker";
import SaveBar from "../../../shared/ui-components/SaveBar";
import Select from "../../../shared/styles/styled-select";
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

const defaultImages = [
    null,
    "https://wallpapercave.com/wp/wp3137855.jpg",
    "https://c4.wallpaperflare.com/wallpaper/237/293/295/3-316-16-9-aspect-ratio-s-sfw-wallpaper-preview.jpg",
    "https://wallpaperaccess.com/full/1406854.jpg",
    "https://c4.wallpaperflare.com/wallpaper/769/628/991/3-316-16-9-aspect-ratio-s-sfw-wallpaper-preview.jpg",
    "https://resi.ze-robot.com/dl/sm/small-memory-by-mikael-gustafsson-1440p-2560%C3%971440.jpg",
    "https://images.wallpaperscraft.com/image/board_black_line_texture_background_wood_55220_2560x1440.jpg",
    "https://1.bp.blogspot.com/-jGzEyxRo5lA/Xu-gD2pjeCI/AAAAAAAAU90/oXBIHt6sXKc0vQp0_3CIxRzxTU3GpLMKwCK4BGAsYHg/w976-h549/DESKTOP-BACKGROUND-HEROSCREEN.CC-UHD-16-9-ASPECT.png",
    "https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.wallpaperscraft.com/image/code_lines_programming_130775_3840x2160.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/858712644520509460/forest_mountains_sunset_cool_weather_minimalism.jpg",
    "https://eskipaper.com/images/rainbow-wallpaper-8.jpg",
];

const defaultWelcomeMessage = (): welcomeMessage => {
    return {
        type: "",
        channel: "",
        message: "Welcome to {server}, {member}",
        hasWelcomeImage: false,
        welcomeImage: {
            backgroundColor: "#00b3c7",
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
    gap: 2rem;
    align-items: center;
`;

const WelcomeImageSettings = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5rem;
    padding: 0.5rem;
`;

const Welcome = () => {
    const router = useRouter();
    const [, serverId] = router.query.type as string[];
    const docRef = firebaseClient.db
        .collection("DiscordSettings")
        .doc(serverId);
    const [snapshot, loading, error] = useDocumentData(docRef);
    const { allChannels, emotes, roles, isPremium, setPremiumModalOpen } =
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
            dispatch({
                type: actions.SET,
                value: cloneDeep(databaseWelcomeMessage),
            });
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

    const { backgroundColor, borderColor, backgroundImage } =
        state.welcomeImage || {};

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
                        width="80%"
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
            <div>
                <WelcomeArea>
                    <SectionTitle>
                        <Switch
                            checked={state.hasWelcomeImage}
                            onChange={(e) => {
                                if (!isPremium) {
                                    return setPremiumModalOpen(true);
                                }
                                dispatch({
                                    type: actions.UPDATE,
                                    value: e.target.checked,
                                    key: "hasWelcomeImage",
                                });
                            }}
                            color="primary"
                            name="checkedB"
                        />{" "}
                        <span className="premium">Welcome Image</span>
                    </SectionTitle>
                    <AnimatePresence>
                        {state.hasWelcomeImage && isPremium && (
                            <WelcomeImageContainer
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                            >
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="711px"
                                    height="400px"
                                >
                                    <defs>
                                        <pattern
                                            id="bgImage"
                                            patternUnits="userSpaceOnUse"
                                            width="711"
                                            height="400"
                                        >
                                            <image
                                                href={backgroundImage}
                                                x="0"
                                                y="0"
                                                width="711"
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
                                        style={{ fill: "url(#bgImage)" }}
                                    ></rect>
                                    <circle
                                        r="90"
                                        cx="50%"
                                        cy="35%"
                                        style={{ fill: borderColor }}
                                    ></circle>
                                    <image
                                        x="50%"
                                        y="35%"
                                        width="180"
                                        height="180"
                                        style={{
                                            clipPath: "circle(46%)",
                                            transform:
                                                "translate(-90px, -90px)",
                                        }}
                                        clip-path="url(#clipCircle)"
                                        href="https://preview.redd.it/nx4jf8ry1fy51.gif?format=png8&s=a5d51e9aa6b4776ca94ebe30c9bb7a5aaaa265a6"
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
                                        <tspan fill="white">David#1000</tspan>
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
                                    <SectionTitle>
                                        Background Color
                                    </SectionTitle>
                                    <ColorPickers>
                                        <Tooltip title="Default">
                                            <ColorPickerBlock
                                                color={"#00b3c7"}
                                                onClick={() =>
                                                    updateBackgroundColor({
                                                        hex: "#00b3c7",
                                                    })
                                                }
                                            />
                                        </Tooltip>
                                        <ColorPickerBlock
                                            onClick={() => {
                                                setBackgroundPickerOpen(true);
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
                                                        color={backgroundColor}
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
                                    <SectionTitle>Border Color</SectionTitle>
                                    <ColorPickers>
                                        <Tooltip title="Default">
                                            <ColorPickerBlock
                                                color={"#eb4d4b"}
                                                onClick={() =>
                                                    updateBorderColor({
                                                        hex: "#eb4d4b",
                                                    })
                                                }
                                            />
                                        </Tooltip>
                                        <ColorPickerBlock
                                            onClick={() => {
                                                setBorderPickerOpen(true);
                                            }}
                                            color={
                                                roleColors.includes(borderColor)
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
                                    <SectionTitle>
                                        Background Image
                                    </SectionTitle>
                                    <Images
                                        style={{
                                            justifyContent: "flex-start",
                                        }}
                                    >
                                        {defaultImages.map((src) => (
                                            <div
                                                key={src}
                                                className={`${
                                                    backgroundImage === src
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >
                                                <ImageContainer
                                                    key={src}
                                                    onClick={() =>
                                                        dispatch({
                                                            type: actions.UPDATE,
                                                            key: "welcomeImage.backgroundImage",
                                                            value: src,
                                                        })
                                                    }
                                                    //@ts-ignore
                                                    src={src}
                                                ></ImageContainer>
                                            </div>
                                        ))}
                                    </Images>
                                </WelcomeImageSettings>
                            </WelcomeImageContainer>
                        )}
                    </AnimatePresence>
                </WelcomeArea>
            </div>
        </WelcomeContainer>
    );
};

export default Welcome;
