import React, { useRef, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
// import { loadImage } from "canvas";
import firebaseClient from "../../firebase/client";

const adminIds = {
	twitch: {
		developers: ["514845764", "125995038", "89983882", "40229165"],
	},
	discord: {
		developers: [
			"193826355266191372",
			"318827575294165002",
			"218174877671096321",
			"209047198544035841",
		],
		supporters: [
			"209047198544035841",
			"406564296835989504",
			"129581672352972800",
			"492114610607095829",
		],
	},
};

const getXp = level => (5 / 6) * level * (2 * level * level + 27 * level + 91);

const applyText = (
	canvas,
	text,
	defaultFontSize = 70,
	minFontSize = 0,
	font = "sans-serif",
	widthTest = null
) => {
	const ctx = canvas.getContext("2d");

	// Declare a base size of the font
	let fontSize = defaultFontSize;
	ctx.font = `${fontSize}px ${font}`;

	while (ctx.measureText(text).width > (widthTest || canvas.width - 300)) {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${(fontSize -= 5)}px ${font}`;
		if (fontSize < minFontSize) return ctx.font;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	}

	// Return the result to use in the actual canvas
	return ctx.font;
};

const roundRect = function (ctx, x, y, w, h, r = 0) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.fill();
	return ctx;
};

const roundCanvas = function (ctx, x, y, w, h, r = 0, cb) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.clip();
	cb();
	ctx.restore();
	return ctx;
};

const loadImage = url => {
	const img = new window.Image();
	img.src = url;
	return img;
};

const generateRankCard = async (canvas: HTMLCanvasElement, userData, user, images) => {};

export const RankCard = props => {
	const canvasRef = useRef(null);
	const [images, setImages] = useState<any>({});

	const { user, userData } = props;
	useEffect(() => {
		(async () => {
			const discordAdmins = adminIds.discord.developers;
			const statuses = {
				online: "https://cdn.discordapp.com/emojis/726982918064570400.png?v=1",
				idle: "https://cdn.discordapp.com/emojis/726982942181818450.png?v=1",
				dnd: "https://cdn.discordapp.com/emojis/726982954580181063.png?v=1",
				offline: "https://cdn.discordapp.com/emojis/702707414927015966.png?v=1",
			};
			const statusUrl = statuses["online"];

			const profileUrl = user?.avatarURL;
			setImages({ avatar: profileUrl, status: statusUrl });
		})();
	}, [user]);

	const primaryColor = userData?.primaryColor || "#c31503";
	const backgroundColor1 = "#1f2525";
	const backgroundColor2 = `#090b0b`;
	const xpBarBackground = "#484b4e";
	const backgroundImage = userData?.backgroundImage;

	// calculate all required values
	const xpToNextLevel = getXp(userData?.level + 1);
	const xpForCurrentLevel = getXp(userData?.level);
	const xpLevelDif = Math.abs(xpToNextLevel - xpForCurrentLevel);
	const xpProgress = Math.abs(userData?.xp - xpForCurrentLevel);
	const percentDone = xpProgress / xpLevelDif;
	const displayXp =
		xpProgress > 1000 ? `${(xpProgress / 1000).toFixed(2)}k` : Math.floor(xpProgress);
	const displayXpToGo = xpLevelDif > 1000 ? `${(xpLevelDif / 1000).toFixed(2)}k` : xpLevelDif;

	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="460px"
			height="140px"
		>
			<defs>
				<pattern id="bgImage" patternUnits="userSpaceOnUse" width="800" height="850">
					<image href={backgroundImage} x="0" y="-50" width="490" height="350" />
				</pattern>
			</defs>
			<rect
				id="rect"
				width="100%"
				height="100%"
				rx="65px"
				ry="65px"
				style={{ fill: `${backgroundImage ? "url(#bgImage)" : backgroundColor1}` }}
			></rect>

			<rect
				y="5%"
				x="2%"
				rx="55"
				ry="55"
				width="96%"
				height="90%"
				style={{ fill: backgroundColor2, opacity: userData?.backgroundOpacity / 255 }}
			></rect>

			<circle r="50" cx="65" cy="71" style={{ fill: "black" }}></circle>
			<clipPath id="clipCircle">
				<circle r="50" cx="65" cy="71"></circle>
			</clipPath>
			<image
				x="17"
				y="22"
				width="100"
				height="100"
				clip-path="url(#clipCircle)"
				xlinkHref={images.avatar}
			></image>

			<image x="80" y="85" width="40" height="40" xlinkHref={images.status}></image>

			<text
				x="230"
				y="85"
				font-family="Poppins"
				font-size="12"
				text-anchor="end"
				style={{ stroke: "black", strokeWidth: "0.2px" }}
			>
				<tspan fill="white">
					RANK
					<tspan font-size="15"> {userData.rank}</tspan>
				</tspan>
				   
				<tspan fill="white">
					{" "}LEVEL
					<tspan font-size="15"> {userData.level + 1}</tspan>
				</tspan>
			</text>

			<text x="137" y="60" font-size="" fill="white">
				{user.username}
				<tspan style={{ fill: "#7F8384" }} font-size="12">
					{user.tag.slice(-5)}
				</tspan>
			</text>

			<rect
				x="135"
				y="65"
				rx="2"
				ry="2"
				width="295"
				height="4"
				style={{ fill: primaryColor }}
			></rect>

			<text
				x="425"
				y="85"
				font-family="Poppins"
				font-size="12"
				fill="white"
				text-anchor="end"
			>
				{displayXp}
				<tspan style={{ fill: "#7F8384" }}> / {displayXpToGo} XP</tspan>
			</text>

			<rect
				x="135"
				y="95"
				rx="12"
				ry="12"
				width="301"
				height="20"
				style={{ fill: "black" }}
			></rect>
			<rect
				x="135"
				y="96"
				rx="9"
				ry="9"
				width="300"
				height="18"
				style={{ fill: xpBarBackground }}
			></rect>
			<rect
				x="130"
				y="96"
				rx="9"
				ry="9"
				width={300 * percentDone}
				height="18"
				style={{ fill: primaryColor }}
			></rect>
		</svg>
	);
};
