import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface headerContextTpe {
	loginModalOpen: boolean;
	setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const headerContext = createContext<headerContextTpe>(null);

export const HeaderContextProvider = ({ children }) => {
	const [loginModalOpen, setLoginModalOpen] = useState(false);

	return (
		<headerContext.Provider value={{ loginModalOpen, setLoginModalOpen }}>
			{children}
		</headerContext.Provider>
	);
};

export const useHeaderContext = () => {
	const context = useContext(headerContext);
	if (!context) {
		throw new Error("useHeaderContext must be used within a header context provider");
	}
	return context;
};
