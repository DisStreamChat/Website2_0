import { isEqual } from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ChromePicker, CirclePicker } from 'react-color';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';

import { ClickAwayListener, Modal, Tooltip, Zoom } from '@material-ui/core';
import ColorizeIcon from '@material-ui/icons/Colorize';

import { authContext } from '../../auth/authContext';
import firebaseClient from '../../firebase/client';
import { RankCard } from '../shared/rankCard';
import { H1 } from '../shared/styles/headings';
import SaveBar from '../shared/ui-components/SaveBar';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const RankCardBody = styled.div`
    width: 100%;
    max-width: 680px;
    height: 775px;
    position: absolute;
    margin: auto;
    border-radius: 0.25rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--background-light-gray);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    hr {
        width: 100%;
    }
    h1 {
        margin-bottom: 1rem;
    }
    canvas {
    }
`;

export const ColorPickers = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    .chrome-picker {
        position: absolute;
        top: 0.5rem;
        z-index: 9;
        left: 150px;
    }
`;

interface RankCardCustomization {
    backgroundImage?: string;
    backgroundOpacity?: number;
    primaryColor?: string;
}

export const roleColors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#e91e63",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#95a5a6",
    "#11806a",
    "#1f8b4c",
    "#206694",
    "#71368a",
    "#ad1457",
    "#c27c0e",
    "#a84300",
    "#992d22",
    "#979c9f",
];

export const ColorPickerBlock = styled.div`
    width: 65px;
    height: 50px;
    border: 1px solid grey;
    border-radius: 0.25rem;
    background: ${(props: any) => props.color};
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    z-index: 10;
`;

const defaultImages = [
    null,
    "https://media.discordapp.net/attachments/727356806552092675/833874021983846403/Webp.net-resizeimage_5.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/833871928736350228/Webp.net-resizeimage.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/833872600135630848/Webp.net-resizeimage_1.jpg",
    "https://cdn.discordapp.com/attachments/727356806552092675/833874721660993536/Webp.net-resizeimage_6.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/833873764903026769/Webp.net-resizeimage_4.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/833871417845874728/Webp.net-resizeimage_1.png",
    "https://media.discordapp.net/attachments/727356806552092675/833870986884939856/Webp.net-resizeimage.png",
    "https://media.discordapp.net/attachments/727356806552092675/833872962409988116/Webp.net-resizeimage_2.jpg",
    "https://media.discordapp.net/attachments/727356806552092675/833873438829576232/Webp.net-resizeimage_3.jpg",
    "https://i2.wp.com/conwayhall.org.uk/wp-content/uploads/2014/11/Deep-space.jpg?resize=700%2C250&ssl=1",
    "data:image/jpeg;base64,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",
];

export const ImageContainer = styled.div`
    overflow: hidden;
    width: 122px;
    height: 50px;
    background-size: cover;
    background-position: center;
    background-image: ${(props: any) => `url(${props.src})`};
    background-color: #1f2525;
    border-radius: 0.5rem;
    position: relative;
    z-index: 2;
`;

export const Images = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    & > div {
        padding: 0.5rem;
        background: #ffffff11;
        border-radius: 0.5rem;
        &.selected {
            background: var(--disstreamchat-blue);
        }
    }
`;

const RankCardModal = ({ open, onClose }) => {
    const { user } = useContext(authContext);
    const [discordUser, setDiscordUser] = useState({});
    const [
        customizationData,
        setCustomizationData,
    ] = useState<RankCardCustomization>({});
    const collectionRef = firebaseClient.db.collection("Streamers");

    const [snapshot, loading, error] = useCollectionData(
        collectionRef.where("discordId", "==", user?.discordId || " ")
    );
    const [pickerOpen, setPickerOpen] = useState(false);

    const dbCustomizationData: RankCardCustomization = useMemo(() => {
        const out = {};
        const properties = [
            "backgroundImage",
            "backgroundOpacity",
            "primaryColor",
        ];
        if (!snapshot) return out;
        for (const doc of snapshot) {
            for (const property of properties) {
                if (doc[property]) {
                    out[property] = doc[property];
                }
            }
        }
        return out;
    }, [snapshot]);

    useEffect(() => {
        setCustomizationData(dbCustomizationData);
    }, [dbCustomizationData]);

    useEffect(() => {
        (async () => {
            if (!user) return;
            const { discordId } = user;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveuser?user=${discordId}`
            );
            const json = await response.json();
            setDiscordUser(json);
        })();
    }, []);

    const updateColor = (color) => {
        console.log(color);
        setCustomizationData((prev) => ({
            ...prev,
            primaryColor: color.hex,
        }));
    };

    const changed = !isEqual(dbCustomizationData, customizationData);

    const save = async () => {
        const queryRef = collectionRef.where("discordId", "==", user.discordId);
        const query = await queryRef.get();
        for (const doc of query.docs) {
            try {
                await collectionRef.doc(doc.id).update(customizationData);
            } catch (err) {
                console.log(err.message);
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                if (changed) return;
                onClose();
            }}
        >
            <Zoom in={open}>
                <RankCardBody>
                    <H1>Customize Your Rank Card</H1>
                    <RankCard
                        user={discordUser}
                        userData={{
                            rank: 1,
                            level: 22,
                            xp: 33058,
                            ...customizationData,
                        }}
                    />
                    <hr />
                    <ColorPickers>
                        <Tooltip title="Default">
                            <ColorPickerBlock
                                color={"#992d22"}
                                onClick={() => updateColor({ hex: "#992d22" })}
                            />
                        </Tooltip>
                        <ColorPickerBlock
                            onClick={() => {
                                setPickerOpen(true);
                            }}
                            color={
                                roleColors.includes(
                                    customizationData.primaryColor
                                )
                                    ? null
                                    : customizationData.primaryColor
                            }
                        >
                            <ColorizeIcon></ColorizeIcon>
                        </ColorPickerBlock>
                        {pickerOpen && (
                            <ClickAwayListener
                                onClickAway={() => {
                                    setPickerOpen(false);
                                }}
                            >
                                <ChromePicker
                                    disableAlpha
                                    color={customizationData.primaryColor}
                                    onChange={updateColor}
                                />
                            </ClickAwayListener>
                        )}
                        <CirclePicker
                            width="380px"
                            color={customizationData.primaryColor}
                            onChangeComplete={updateColor}
                            colors={roleColors}
                        />
                    </ColorPickers>
                    <input
                        type="range"
                        value={customizationData.backgroundOpacity}
                        min={16}
                        max={255}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setCustomizationData((prev) => ({
                                ...prev,
                                backgroundOpacity: Number(e.target.value),
                            }));
                        }}
                    />
                    <Images>
                        {defaultImages.map((src) => (
                            <div
                                key={src}
                                className={`${
                                    customizationData.backgroundImage === src
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <ImageContainer
                                    key={src}
                                    onClick={() =>
                                        setCustomizationData((prev) => ({
                                            ...prev,
                                            backgroundImage: src,
                                        }))
                                    }
                                    //@ts-ignore
                                    src={src}
                                ></ImageContainer>
                            </div>
                        ))}
                    </Images>
                    <SaveBar
                        save={save}
                        reset={() => {
                            setCustomizationData(dbCustomizationData);
                        }}
                        changed={changed}
                    />
                </RankCardBody>
            </Zoom>
        </Modal>
    );
};

export default RankCardModal;
