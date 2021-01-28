// import Document, { Html, Head, Main, NextScript } from "next/document";

// class MyDocument extends Document {
// 	static async getInitialProps(ctx) {
// 		const initialProps = await Document.getInitialProps(ctx);
// 		return { ...initialProps };
// 	}

// 	render() {
// 		return (
// 			<Html lang="en">
// 				<Head />
// 				<body>
// 					<Main />
// 					<NextScript />
// 				</body>
// 			</Html>
// 		);
// 	}
// }

// export default MyDocument;

import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/core/styles";
export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="theme-color" content="#17181b" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

MyDocument.getInitialProps = async ctx => {
	const styledComponentSheet = new StyledComponentSheets();
	const materialUiSheets = new MaterialUiServerStyleSheets();
	const originalRenderPage = ctx.renderPage;
	try {
		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: App => props =>
					styledComponentSheet.collectStyles(
						materialUiSheets.collect(<App {...props} />)
					),
			});
		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
			styles: [
				<React.Fragment key="styles">
					{initialProps.styles}
					{materialUiSheets.getStyleElement()}
					{styledComponentSheet.getStyleElement()}
				</React.Fragment>,
			],
		};
	} finally {
		styledComponentSheet.seal();
	}
};
