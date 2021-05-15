import nookies from "nookies";
import { useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { verifyIdToken } from "../firebase/admin";
import { redirect_uri } from "../utils/constants";
import styled from "styled-components";
import Error from "../components/shared/error";

const ErrorMain = styled.div`
	min-height: calc(100vh - 130px);
`;

const Oauth = props => {
	const { user } = useAuth();
	useEffect(() => {
		console.log(JSON.parse(props.details));
		if (typeof window !== "undefined" && user) {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/details?id=${user.uid}`, {
				method: "POST",
				body: props.details,
				headers: { "content-type": "application/json" },
			}).then(() => {
				window.close();
			});
		}
		setTimeout(() => {}, 200);
	}, [user]);

	return props.error ? (
		<ErrorMain>
			<Error
				message={`An unexpected error occured while signing in, please try again`}
				title="Sign in Error"
			/>
		</ErrorMain>
	) : (
		<></>
	);
};

export const getServerSideProps = async context => {
	const { req, res, params, query } = context;
	const { code, discord } = query;
	try {
		if (discord) {
			const cookies = nookies.get(context);
			const user = (await verifyIdToken(cookies["auth-token"] || " ")) as any;
			const isSignedIn = !!user;

			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_URL
				}/discord/token?code=${code}&create=${!isSignedIn}&redirect_uri=${encodeURIComponent(
					redirect_uri
				)}`
			);
			const clone = response.clone();
			if (response.ok) {
				const json = await response.json();
				if (!isSignedIn) {
					nookies.set(context, "temp-token", json.token, { maxAge: 60, path: "/" });
					nookies.set(context, "auth-token", json.token, { sameSite: "lax", path: "/" });
				}
				return { props: { details: JSON.stringify(json) } };
			}
			return { props: { error: true } };
		} else {
			const response = await fetch("https://api.disstreamchat.com/token?code=" + code);
			const json = await response.json();
			if (response.ok) {
				nookies.set(context, "temp-token", json.token, { maxAge: 60, path: "/" });
				nookies.set(context, "auth-token", json.token, { sameSite: "lax", path: "/" });
			}
		}
	} catch (err) {}
	return { props: {} };
};

export default Oauth;
