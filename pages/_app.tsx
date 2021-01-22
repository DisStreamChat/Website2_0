import Router from "next/router";
import NProgress from "nprogress";
import SEO from "../components/utils/SEO"

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
	return <>{children}</>;
};

function MyApp({ Component, pageProps }) {
	return (
		<App>
			<SEO/>
			<Component {...pageProps} />
		</App>
	);
}

export default MyApp;
