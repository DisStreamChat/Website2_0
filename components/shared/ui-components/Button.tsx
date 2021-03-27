import {
	createMuiTheme,
	createStyles,
	withStyles,
	makeStyles,
	Theme,
	ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { green, purple } from "@material-ui/core/colors";
import styled from "styled-components";
import chroma from "chroma-js";

export const PaddingButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#333333"),
		background: "#333333",
		padding: ".5rem 1.5rem",
	},
}))(Button);

export const PurpleButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#462b45"),
		background: "#462b45",
		"&:hover": {
			background: chroma("#462b45").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const BlueButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#2d688d"),
		background: "#2d688d",
		"&:hover": {
			background: chroma("#2d688d").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const DiscordButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#6f86d4"),
		background: "#6f86d4",
		"&:hover": {
			background: chroma("#6f86d4").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const TwitchButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#923dbd"),
		background: "#923dbd",
		"&:hover": {
			background: chroma("#923dbd").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const OrangeButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#f95515"),
		background: "linear-gradient(283deg,#f9af15,#f95515)",
		"&:hover": {
			boxShadow: "0 0 35px #f9af15, inset 0 0 20px #f95515",
		},
		
	},
}))(PaddingButton);

export const RedButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#9b0e11"),
		background: "#9b0e11",
		"&:hover": {
			background: chroma("#9b0e11").darken(0.5).hex(),
		},
	},
}))(PaddingButton);

export const DeleteButton = withStyles((theme: Theme) => ({
	root: {
		color: "#f45656",
		border: "2px solid #9b0e11",
		background: "#333333aa",
		"&:hover": {
			border: `2px solid ${chroma("#9b0e11").darken(0.5).hex()}`,
		},
	},
}))(PaddingButton);

export const GreenButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#44b37f"),
		background: "#44b37f",
		"&:hover": {
			background: chroma("#44b37f").darken(0.5).hex(),
		},
	},
}))(PaddingButton);

interface DescriptionProps {
	onClick: () => void;
	title: string;
	description: string;
	icon: JSX.Element;
}

export const DescriptionButton = (props: DescriptionProps) => {
	return (
		<div className="create-command" onClick={() => props?.onClick?.()}>
			{props.icon}
			<h1>{props.title}</h1>
			<p>{props.description}</p>
		</div>
	);
};

export const EmptyButton = styled.button`
	background: none;
	outline: none;
	border: none;
	text-align: left;
	color: white;
	
`
