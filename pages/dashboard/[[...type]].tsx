import { AnimateSharedLayout } from "framer-motion";
import Link from "next/link";
import nookies from "nookies";
import { verifyIdToken } from "../../firebase/admin";
import {
	DashboardContainer,
	SideBar,
	SideBarItem,
	Background,
	ContentArea,
} from "../../components/dashboard/styles";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import DashboardHeader from "../../components/header/dashboard";
import React, { useEffect } from "react";
import { HeaderContextProvider } from "../../components/header/context";
import admin from "firebase-admin";
import { useRouter } from "next/router";
const Discord = dynamic(() => import("../../components/dashboard/Discord/Discord"));
const App = dynamic(() => import("../../components/dashboard/App"));

const Dashboard = ({ type, session }) => {
	const router = useRouter();

	useEffect(() => {
		if (!type?.[0]) {
			router.push("/dashboard/discord");
		}
	}, [type]);

	return (
		<>
			{session && (
				<HeaderContextProvider>
					<DashboardHeader user={session.user} serverId={type[1]}/>
				</HeaderContextProvider>
			)}
			<DashboardContainer>
				<ContentArea>
					{type?.[0] === "discord" && <Discord session={session} />}
					{type?.[0] === "app" && <App session={session} />}
				</ContentArea>
			</DashboardContainer>
		</>
	);
};

const parseCookies = (
	cookieString: string
): {
	[key: string]: string;
} => {
	const cookieStrings = cookieString.split(";").map(cookie => cookie.trim());
	const parsedCookieStrings = cookieStrings.map(cookie => cookie.split("="));
	const parsedCookies = parsedCookieStrings.reduce((acc, cur) => {
		const [key, value] = cur;
		if (!acc[key] || acc[key]?.length < value.length) acc[key] = value;
		return acc;
	}, {});
	return parsedCookies;
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { req, res, params } = context;
	let session = null;
	// const cookies = parseCookies(req.headers.cookie);
	const cookies = nookies.get(context);
	try {
		const token = await verifyIdToken(cookies["auth-token"]);
		if (!token) throw new Error("no token");
		if (typeof token === "boolean") session = token;
		else {
			const { uid } = token;
			session = { uid };
			const userRef = admin.firestore().collection("Streamers").doc(uid);
			const userDisordRef = userRef.collection("discord").doc("data");
			const userDoc = await userRef.get();
			const userDiscordDoc = await userDisordRef.get();
			const userData = userDoc.data();
			const userDiscordData = userDiscordDoc.data();
			session.user = { ...userData, ...userDiscordData };
		}
	} catch (err) {
		console.log("error: ", err.message);
		res.writeHead(307, { location: "/" }).end();
		return { props: {} };
	}

	if (!params.type) {
		res.writeHead(307, { location: "/dashboard/discord" }).end();
		return { props: {} };
	}

	if (params.type && !["app", "discord"].includes(params.type[0])) {
		return { notFound: true };
	}
	return { props: { type: params.type || null, session } };
};

export default Dashboard;
