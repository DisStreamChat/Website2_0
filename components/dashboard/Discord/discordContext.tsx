import { useRouter } from "next/router";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import firebaseClient from "../../../firebase/client";
import { role as Role } from "../../../utils/types";

interface obj<T = any> {
	[key: string]: T;
}

interface channel {
	id: string;
	name: string;
	parent: string;
}

interface settings {
	prefix: string;
	nickname: string;
	adminRoles: obj[];
}

interface discordContextTpe {
	currentGuild: obj;
	setCurrentGuild: Dispatch<SetStateAction<obj>>;
	roles: Role[];
	setRoles: Dispatch<SetStateAction<obj[]>>;
	adminRoles: obj[];
	setAdminRoles: Dispatch<SetStateAction<obj[]>>;
	serverSettings: settings;
	setServerSettings: Dispatch<SetStateAction<settings>>;
	activePlugins: obj<boolean>;
	setActivePlugins: Dispatch<SetStateAction<obj<boolean>>>;
	allChannels: channel[];
	setAllChannels: Dispatch<SetStateAction<channel[]>>;
	emotes: obj[];
	setEmotes: Dispatch<SetStateAction<obj[]>>;
}

export const discordContext = createContext<discordContextTpe>(null);

export const DiscordContextProvider = ({ children }) => {
	const [currentGuild, setCurrentGuild] = useState({});
	const [roles, setRoles] = useState<Role[]>([]);
	const [adminRoles, setAdminRoles] = useState([]);
	const [allChannels, setAllChannels] = useState<channel[]>([]);
	const [serverSettings, setServerSettings] = useState<settings>({
		prefix: "!",
		nickname: "DisStreamBot",
		adminRoles: [],
	});
	const [emotes, setEmotes] = useState<obj[]>([]);
	const [activePlugins, setActivePlugins] = useState<obj<boolean>>({});
	const router = useRouter();

	const [, serverId] = router.query.type as string[];

	useEffect(() => {
		if (!serverId || serverId === "discord") return;
		const fetchFromApi = async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
			);
			const json = await response.json();
			if (!json) return;
			setCurrentGuild(json);
			const roleResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/getchannels?new=true&guild=${serverId}`
			);
			const roleJson = await roleResponse.json();
			setAllChannels(roleJson.channels);
			const allRoles: Role[] = roleJson.roles;
			setRoles(allRoles);
			setAdminRoles(
				allRoles.filter(
					// I can do discord permission math 😊
					role =>
						((role.permissions & 32) === 32 || (role.permissions & 8) === 8) &&
						!role.managed
				)
			);
			const emoteResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/emotes`
			);
			const emoteJson = await emoteResponse.json();
			setEmotes(emoteJson);
		};
		const fetchFromFirebase = async () => {
			const serverRef = firebaseClient.db.collection("DiscordSettings").doc(serverId);
			const serverDoc = await serverRef.get();
			const serverData = serverDoc.data();
			try {
				const { activePlugins: plugins, ...settings } = serverData;
				if (!plugins) {
					serverRef.set({ activePlugins: {} }, { merge: true });
				}
				setActivePlugins(plugins || {});
				setServerSettings(prev => ({ ...prev, ...settings }));
			} catch (err) {
				setActivePlugins({});
				setServerSettings({ prefix: "!", nickname: "DisStreamBot", adminRoles: [] });
				firebaseClient.db.collection("DiscordSettings").doc(serverId).set({
					activePlugins: {},
					prefix: "!",
					nickname: "DisStreamBot",
					adminRoles: [],
				});
			}
		};
		Promise.all([fetchFromApi(), fetchFromFirebase()]).then(() => console.log("done"));
	}, [serverId]);

	return (
		<discordContext.Provider
			value={{
				currentGuild,
				setCurrentGuild,
				roles,
				setRoles,
				adminRoles,
				setAdminRoles,
				serverSettings,
				setServerSettings,
				activePlugins,
				setActivePlugins,
				allChannels,
				setAllChannels,
				emotes,
				setEmotes,
			}}
		>
			{children}
		</discordContext.Provider>
	);
};

export const useDiscordContext = () => {
	const context = useContext(discordContext);
	if (!context) {
		throw new Error("useDiscordContext must be used within a discord context provider");
	}
	return context;
};
