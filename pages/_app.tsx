import Router from "next/router";
import NProgress from "nprogress";
import dynamic from "next/dynamic"
const Footer = dynamic(() => import("../components/footer"))
// import Footer from "../components/footer";
import Header from "../components/header";
import GlobalStyle from "../components/utils/GlobalStyle";
import SEO from "../components/utils/SEO";
import {
	createMuiTheme,
	ThemeProvider,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../components/shared/error";
import { HeaderContextProvider } from "../components/header/context";
import { AuthContextProvider } from "../auth/authContext";

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

	const [error, setError] = useState(false);

	Router.events.on("routeChangeStart", () => {
		setError(false);
	});

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<SEO />
			<HeaderContextProvider>
				<Header />
			</HeaderContextProvider>
			<ErrorBoundary
				resetKeys={[error]}
				FallbackComponent={({ error }) => (
					<Error
						message={`An unexpected error occured: ${error.message}`}
						title="Uncaught Exception"
					/>
				)}
				onError={() => setError(true)}
				onReset={() => {
					// reset the state of your app so the error doesn't happen again
				}}
			>
				{children}
			</ErrorBoundary>
			<Footer />
		</ThemeProvider>
	);
};

function MyApp({ Component, pageProps }) {
	return (
		<AuthContextProvider>
			<App>
				<Component {...pageProps} />
			</App>
		</AuthContextProvider>
	);
}

export default MyApp;
