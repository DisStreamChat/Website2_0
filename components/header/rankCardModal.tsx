import { ClickAwayListener, Modal, Tooltip, Zoom } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { authContext } from "../../auth/authContext";
import { RankCard } from "../shared/rankCard";
import firebaseClient from "../../firebase/client";
import { H1 } from "../shared/styles/headings";
import { ChromePicker, CirclePicker } from "react-color";
import { isEqual } from "lodash";
import SaveBar from "../shared/ui-components/SaveBar";
import ColorizeIcon from "@material-ui/icons/Colorize";

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

const ColorPickers = styled.div`
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

const roleColors = [
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

const ColorPickerBlock = styled.div`
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
	"https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	"https://images-ext-2.discordapp.net/external/1xr7k4L61jYSnr9zuXjosHJPXwYUxm2Tqv6AK0u4oBg/%3Fw%3D800%26dpr%3D1%26fit%3Ddefault%26crop%3Ddefault%26q%3D65%26vib%3D3%26con%3D3%26usm%3D15%26bg%3DF4F4F3%26ixlib%3Djs-2.2.1%26s%3D9465282a2b0a375f4f5b120d7bbad882/https/img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v462-n-130-textureidea_1.jpg",
	"https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
	"https://cdn.pixabay.com/photo/2018/09/19/23/03/sunset-3689760__340.jpg",
	"https://venngage-wordpress.s3.amazonaws.com/uploads/2018/09/Colorful-Geometric-Simple-Background-Image.jpg",
	"https://i.imgur.com/UggflEP.png",
	"https://i.imgur.com/Wbojl9H.jpeg",
	"https://i.imgur.com/SDqtIcO.jpeg",
	"https://i.imgur.com/iUVdIDX.jpeg",
	"https://i.imgur.com/IPb234z.jpeg",
	"https://i.imgur.com/Wt8moQY.jpg",
];

const ImageContainer = styled.div`
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

const Images = styled.div`
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
	const [customizationData, setCustomizationData] = useState<RankCardCustomization>({});
	const collectionRef = firebaseClient.db.collection("Streamers");
	const [snapshot, loading, error] = useCollectionData(
		collectionRef.where("discordId", "==", user.discordId)
	);
	const [pickerOpen, setPickerOpen] = useState(false);

	const dbCustomizationData: RankCardCustomization = useMemo(() => {
		const out = {};
		const properties = ["backgroundImage", "backgroundOpacity", "primaryColor"];
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
			const { discordId } = user;

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveuser?user=${discordId}`
			);
			const json = await response.json();
			setDiscordUser(json);
		})();
	}, []);

	const updateColor = color => {
		console.log(color);
		setCustomizationData(prev => ({
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
				console.log(err.message)
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
						userData={{ rank: 1, level: 22, xp: 33058, ...customizationData }}
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
								roleColors.includes(customizationData.primaryColor)
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
						onChange={e => {
							console.log(e.target.value);
							setCustomizationData(prev => ({
								...prev,
								backgroundOpacity: Number(e.target.value),
							}));
						}}
					/>
					<Images>
						{defaultImages.map(src => (
							<div
								className={`${
									customizationData.backgroundImage === src ? "selected" : ""
								}`}
							>
								<ImageContainer
									onClick={() =>
										setCustomizationData(prev => ({
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
