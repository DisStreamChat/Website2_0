import nookies from "nookies";
import { useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { verifyIdToken } from "../firebase/admin";
import firebaseClient from "../firebase/client";
import admin from "firebase-admin"
import { redirect_uri } from "../utils/constants";

const Oauth = () => {
	const { user } = useAuth();
	useEffect(() => {
		if (typeof window !== "undefined" && user) {
			window.close();
		}
	}, [user]);
	return <></>;
};

export const getServerSideProps = async context => {
	const { req, res, params, query } = context;
	const { code, discord } = query;
	try {
		if (discord) {
			const cookies = nookies.get(context);
			const user = await verifyIdToken(cookies["auth-token"] || " ") as any;
			const isSignedIn = !!user

			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_URL
				}/discord/token?code=${code}&create=${!isSignedIn}&redirect_uri=${encodeURIComponent(
					redirect_uri
				)}/${encodeURIComponent(
					"?discord=true"
				)}`
			);
			if (response.ok) {
				const json = await response.json();
				let discordUser;
				if (!isSignedIn) {
					discordUser = verifyIdToken(json.token) as any
					nookies.set(context, "temp-token", json.token, { maxAge: 60, path: "/" });
					// const user = await firebaseClient.auth.signInWithCustomToken(json.token)
					// console.log(user)
					nookies.set(context, "auth-token", json.token, { sameSite: "lax", path: "/" });
				}
				await admin.firestore()
						.collection("Streamers")
						.doc(user?.uid || discordUser?.uid || " ")
						.collection("discord")
						.doc("data")
						.set(json);
				console.log("success");
			}
		} else {
			const response = await fetch("https://api.disstreamchat.com/token?code=" + code);
			const json = await response.json();
			if (response.ok) {
				nookies.set(context, "temp-token", json.token, { maxAge: 60, path: "/" });
				// const user = await firebaseClient.auth.signInWithCustomToken(json.token)
				// console.log(user)
				nookies.set(context, "auth-token", json.token, { sameSite: "lax", path: "/" });
			}
			// res.writeHead(307, { location: "/dashboard/app" }).end();
		}
	} catch (err) {}
	return { props: {} };
};

export default Oauth;
