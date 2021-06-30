import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../components/footer"));
// import Footer from "../components/footer";
import Header from "../components/header";
import GlobalStyle from "../components/utils/GlobalStyle";
import SEO from "../components/utils/SEO";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../components/shared/error";
import { HeaderContextProvider } from "../components/header/context";
import { AuthContextProvider } from "../auth/authContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

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
    const router = useRouter();

    const [error, setError] = useState(false);

    Router.events.on("routeChangeStart", () => {
        setError(false);
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (router.asPath.includes("dashboard")) {
            document.body.style.overflow = "hidden hidden";
        } else {
            document.body.style.overflow = "visible visible";
        }
    }, [router.asPath]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <SEO />
                {!router.pathname.includes("dashboard") && (
                    <HeaderContextProvider>
                        <Header />
                    </HeaderContextProvider>
                )}
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
                {!router.asPath.includes("dashboard") && <Footer />}
            </ThemeProvider>
        </QueryClientProvider>
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
