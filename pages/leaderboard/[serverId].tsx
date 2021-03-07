import { GetServerSideProps } from "next";
import admin from "../../firebase/admin";
import firebaseClient from "../../firebase/client";

const Leaderboard = ({users}) => {
	return <></>;
};

const levelingIsEnabled = async serverId => {
	const settingsRef = admin.firestore().collection("DiscordSettings").doc(serverId);
	const settings = (await settingsRef.get()).data();
	const activePlugins = settings?.activePlugins
	const levelingEnabled = activePlugins?.leveling

	if (!settings || !levelingEnabled) {
		return { notFound: true };
	}
}

export const getServerSideProps: GetServerSideProps = async context => {
	const { req, res, params } = context;

	const serverId = params.serverId as string;
	const levelingRef = admin.firestore().collection("Leveling").doc(serverId).collection("users").orderBy("xp", "asc").limit(100);
	
	const leveling = (await levelingRef.get()).docs?.map(doc => ({ id: doc.id, doc, ...doc.data() }));
	
	if(!await levelingIsEnabled(serverId) || leveling?.length === 0){
		return {notFound: true}
	}
	
	return { props: {
		users: leveling, 
	} };
};

export default Leaderboard;
