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
			boxShadow: "4px 4px 10px 0px #000000",
		}
	},
}))(PaddingButton);

export const RedButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#9b0e11"),
		background: "#9b0e11",
	},
}))(PaddingButton);
