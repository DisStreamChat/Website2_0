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
		backgroundColor: " #462b45",
		"&:hover": {
			backgroundColor: chroma("#462b45").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const BlueButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#2d688d"),
		backgroundColor: "#2d688d",
		"&:hover": {
			backgroundColor: chroma("#2d688d").darken(0.25).hex(),
		},
	},
}))(PaddingButton);

export const OrangeButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText("#f95515"),
		background: "linear-gradient(283deg,#f9af15,#f95515)",
	},
}))(PaddingButton);