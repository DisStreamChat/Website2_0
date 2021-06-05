import { heightFunction, Main } from "../components/shared/styles";
import styled from "styled-components";
import firebaseClient from "../firebase/client";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import { RedButton } from "../components/shared/ui-components/Button";

const AccountMain = styled(Main)`
	${heightFunction()}
	max-width: 900px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const AccountContainer = styled.div`
	width: 100%;
	margin: 3rem 0;
	overflow: hidden;
	border-radius: 0.5rem;
`;

const AccountHeader = styled.div`
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	height: 50px;
	&.discord {
		background: #6665d2;
	}
	&.twitch {
		background: #503086;
	}
`;

const AccountBody = styled.div`
	box-sizing: border-box !important;
	min-height: 100px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 2rem;
	&.discord {
		background: #7289da;
	}
	&.twitch {
		background: #593695;
	}
`;

const AccountName = styled.div`
	margin-left: 1ch;
	line-height: 1rem;
	p:nth-child(2) {
		font-size: 0.75rem;
	}
`;

interface AccountProps {
	name: string;
	avatar: string;
	type: "twitch" | "discord";
	main: string;
}

const AccountCard = (props: AccountProps) => {
	const currentUser = firebaseClient.auth.currentUser;

	const disconnect = async () => {
		await firebaseClient.db
			.collection("Streamers")
			.doc(currentUser?.uid || " ")
			.collection(props.type)
			.doc("data")
			.delete();
	};

	return (
		<AccountContainer className={props.type}>
			<AccountHeader className={props.type}>
				<img src={props.avatar} width="32" height="32"></img>
				<AccountName>
					<p>{props.name}</p>
					<p>Account Name</p>
				</AccountName>
			</AccountHeader>
			<AccountBody className={props.type}>
				{props.main !== props.type && (
					<RedButton onClick={() => (props.main === props.type ? null : disconnect())}>
						{props.main === props.type ? "Delete" : "Disconnect"} Account
					</RedButton>
				)}
			</AccountBody>
		</AccountContainer>
	);
};

interface AccountModel {
	avatar: string;
	name: string;
	id?: string;
}

enum AccountTypes {
	DISCORD = "discord",
	TWITCH = "twitch",
}

interface AccountDataModel {
	twitch?: AccountModel;
	discord?: AccountModel;
	main?: AccountTypes;
}

const Account = () => {
	const currentUser = firebaseClient.auth.currentUser;
	const [accountData, setAccountData] = useState<AccountDataModel>({ main: null });

	useEffect(() => {
		(async () => {
			const userRef = firebaseClient.db.collection("Streamers").doc(currentUser?.uid);
			const discordRef = userRef.collection("discord").doc("data");
			const twitchRef = userRef.collection("twitch").doc("data");
			const userData = (await userRef.get()).data();

			if (!userData) return;
			const twitchData = (await twitchRef.get()).data();
			const discordData = (await discordRef.get()).data();
			discordRef.onSnapshot(snapshot => {
				const discordData = snapshot.data();
				if (discordData) {
					const { name, profilePicture } = discordData;
					setAccountData(prev => {
						let out = prev ?? {};
						return { ...out, discord: { name, avatar: profilePicture } };
					});
				} else {
					setAccountData(prev => {
						let out = prev ?? {};
						return { ...out, discord: null };
					});
				}
			});
			if (twitchData) {
				const { name, profilePicture } = userData;
				setAccountData(prev => {
					let out = prev ?? {};
					return { ...out, twitch: { name, avatar: profilePicture } };
				});
			}
			setAccountData(prev => {
				let out = prev ?? {};
				const discordId = discordData?.id;
				const twitchId = twitchData?.["user_id"];

				let main =
					sha1(discordId) === currentUser.uid
						? AccountTypes.DISCORD
						: sha1(twitchId) === currentUser.uid
						? AccountTypes.TWITCH
						: null;
				return { ...out, main };
			});
		})();
	}, [currentUser]);

	return (
		<AccountMain>
			{accountData.twitch && (
				<AccountCard
					type="twitch"
					name={accountData.twitch.name}
					avatar={accountData.twitch.avatar}
					main={accountData.main}
				></AccountCard>
			)}
			{accountData.discord && (
				<AccountCard
					type="discord"
					name={accountData.discord.name}
					avatar={accountData.discord.avatar}
					main={accountData.main}
				></AccountCard>
			)}
		</AccountMain>
	);
};

export default Account;
