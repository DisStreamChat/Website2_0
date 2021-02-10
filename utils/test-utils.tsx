import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { useMemo } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const MaterialWrapper = ({ children }) => {
	const theme = useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: "dark",
					primary: {
						light: "#a6d4fa",
						main: "#90caf9",
						dark: "#648dae",
						contrastText: "#ffffff",
					},
				},
			}),
		[]
	);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui, options={}) =>
	render(ui, {
		wrapper: MaterialWrapper,
		...options,
	});

export * from "@testing-library/react"
export {customRender as render} 