import nookies from "nookies";
import { useEffect } from "react";
import { useAuth } from "../auth/authContext";
import firebaseClient from "../firebase/client";

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
	const { code } = query;
	try {
		const response = await fetch("https://api.disstreamchat.com/token?code=" + code);
		const json = await response.json();
		if (response.ok) {
			nookies.set(context, "temp-token", json.token, { maxAge: 60 });
			// const user = await firebaseClient.auth.signInWithCustomToken(json.token)
			// console.log(user)
			nookies.set(context, "dsc-auth-token", json.token);
		}
		// res.writeHead(307, { location: "/dashboard/app" }).end();
	} catch (err) {}
	return { props: {} };
};

export default Oauth;
