import Router from "next/router";
import NProgress from "nprogress";
import Footer from "../components/footer";
import Header from "../components/header";
import GlobalStyle from "../components/utils/GlobalStyle";
import SEO from "../components/utils/SEO";
import {
	Avatar,
	createMuiTheme,
	InputAdornment,
	ThemeProvider,
	useMediaQuery,
} from "@material-ui/core";
import { useMemo } from "react";

Router.events.on("routeChangeStart", () => {
	NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
	NProgress.done();
});

Router.events.on("routeChangeError", () => {
	NProgress.done();
});

const App = ({ children }) => {
	const theme = useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: "dark",
				},
			}),
		[]
	);

	return (
		<ThemeProvider theme={theme}>
			<Header />
			{children}
			<Footer />
		</ThemeProvider>
	);
};

function MyApp({ Component, pageProps }) {
	return (
		<App>
			<GlobalStyle />
			<SEO />
			<Component {...pageProps} />
		</App>
	);
}

export default MyApp;
