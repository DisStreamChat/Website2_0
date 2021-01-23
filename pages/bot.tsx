import Head from "next/head";
import { Main, Hero } from "../components/shared/styles";

const Bot = () => {
	return (
		<>
			<Head>
				<title>DisStreamChat | Discord Bot</title>

				<meta
					data-n-head="ssr"
					data-hid="og:image"
					property="og:image"
					content="https://media.discordapp.net/attachments/710157323456348210/710185505391902810/discotwitch_.png?width=677&height=677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:type"
					property="og:image:type"
					content="image/png"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:width"
					property="og:image:width"
					content="677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:height"
					property="og:image:height"
					content="677"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:image:alt"
					property="og:image:alt"
					content="DisStreamChat's logo"
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:description"
					property="og:description"
					content="An incredibly easy to use and feature filled Discord bot to help you make your server the best it can be."
				/>
				<meta
					data-n-head="ssr"
					data-hid="og:title"
					property="og:title"
					content="DisStreamBot"
				/>
			</Head>
			<Main>
				<Hero></Hero>
			</Main>
		</>
	);
};

export default Bot;
