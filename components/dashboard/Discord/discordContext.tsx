import { useRouter } from "next/router";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type obj = { [key: string]: any };

interface settings {
	commandPrefix: string;
	nickname: string;
	adminRoles: obj[];
}

interface discordContextTpe {
	currentGuild: obj;
	setCurrentGuild: Dispatch<SetStateAction<obj>>;
	roles: obj[];
	setRoles: Dispatch<SetStateAction<obj[]>>;
	adminRoles: obj[];
	setAdminRoles: Dispatch<SetStateAction<obj[]>>;
	serverSettings: settings;
	setServerSettings: Dispatch<SetStateAction<settings>>;
}

export const discordContext = createContext<discordContextTpe>(null);

export const DiscordContextProvider = ({ children }) => {
	const [currentGuild, setCurrentGuild] = useState({});
	const [roles, setRoles] = useState([]);
	const [adminRoles, setAdminRoles] = useState([]);
	const [serverSettings, setServerSettings] = useState<settings>(null);
	const router = useRouter();

	const [, serverId] = router.query.type as string[];

	useEffect(() => {
		(async () => {
			if (!serverId) return;
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
			);
			const json = await response.json();
			if(!json)return
			setCurrentGuild(json);
			const roleResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/getchannels?new=true&guild=${serverId}`
			);
			const roleJson = await roleResponse.json();
			const allRoles = roleJson.roles.filter(role => role.name !== "@everyone");
			setRoles(allRoles);
			setAdminRoles(
				allRoles.filter(
					// I can do discord permission math 😊
					role =>
						((role.permissions & 32) === 32 || (role.permissions & 8) === 8) &&
						!role.managed
				)
			);
		})();
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
