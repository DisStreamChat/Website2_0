import { useRouter } from "next/router";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type obj = { [key: string]: any };
interface discordContextTpe {
	currentGuild: obj;
	setCurrentGuild: Dispatch<SetStateAction<obj>>;
	roles: obj[];
	setRoles: Dispatch<SetStateAction<obj[]>>;
}

export const discordContext = createContext<discordContextTpe>(null);

export const DiscordContextProvider = ({ children }) => {
	const [currentGuild, setCurrentGuild] = useState({});
	const [roles, setRoles] = useState([]);

	const router = useRouter();

	const [, serverId] = router.query.type as string[];

	useEffect(() => {
		(async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
			);
			const json = await response.json();
			setCurrentGuild(json);
			const roleResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v2/discord/getchannels?new=true&guild=${serverId}`
			);
			const roleJson = await roleResponse.json();
			setRoles(roleJson.roles);
		})();
	}, [serverId]);

	return (
		<discordContext.Provider value={{ currentGuild, setCurrentGuild, roles, setRoles }}>
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
