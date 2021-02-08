import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface discordContextTpe {
	loginModalOpen: boolean;
	setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const discordContext = createContext<discordContextTpe>(null);

export const DiscordContextProvider = ({ children }) => {
	const [loginModalOpen, setLoginModalOpen] = useState(false);

	return (
		<discordContext.Provider value={{ loginModalOpen, setLoginModalOpen }}>
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
