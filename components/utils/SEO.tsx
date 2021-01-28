import Head from "next/head";

const SEO = () => {
	return (
		<Head>
			<meta charSet="utf-8" />
			<link rel="icon" href="/logo.png" />
			<link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" as="style" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="theme-color" content="#17181b" />
			<meta name="title" content="DisStreamChat" />
			<meta httpEquiv="Content-Security-Policy" content="" />
			<meta name="keywords" content="disstreamchat discord twitch disstreambot" />
			<meta
				name="description"
				content="An incredibly easy to use and feature filled system for connecting Twitch and Discord chat."
			/>
			<meta name="image" content="/logo.png" />
			<meta name="application-name" content="disstreamchat" />
			<meta
				data-n-head="ssr"
				data-hid="og:url"
				property="og:url"
				content="https://www.disstreamchat.com"
			/>
			<meta data-n-head="ssr" data-hid="og:type" property="og:type" content="website" />
			<meta
				data-n-head="ssr"
				data-hid="og:site_name"
				property="og:site_name"
				content="DisStreamChat"
			/>
			<meta data-n-head="ssr" data-hid="og:locale" property="og:locale" content="en_US" />
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
				content="An incredibly easy to use and feature filled system for connecting Twitch and Discord chat."
			/>
			<meta
				data-n-head="ssr"
				data-hid="og:title"
				property="og:title"
				content="DisStreamChat - The Best Discord/Twitch chat manager"
			/>
			<link
				rel="preload"
				href="https://cdn.jsdelivr.net/gh//GypsyDangerous/simple-css-reset/reset.css"
				as="style"
			/>
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/gh//GypsyDangerous/simple-css-reset/reset.css"
			/>
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css"
				integrity="sha512-DanfxWBasQtq+RtkNAEDTdX4Q6BPCJQ/kexi/RftcP0BcA4NIJPSi7i31Vl+Yl5OCfgZkdJmCqz+byTOIIRboQ=="
				crossOrigin="anonymous"
			/>
			<title>DisStreamChat</title>
		</Head>
	);
};

export default SEO;
