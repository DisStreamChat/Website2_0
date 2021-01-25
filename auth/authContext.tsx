import { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import firebaseClient from "../firebase/client";
import firebase from "firebase";

interface authType {
	user: firebase.User;
	isLoggedIn: boolean
}

export const authContext = createContext<authType>(null);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		return firebaseClient.auth.onIdTokenChanged(async user => {
			if (!user) {
				setUser(null);
				nookies.set(undefined, "token", "");
				return;
			}
			const token = await user.getIdToken();
			setUser(user);
			nookies.set(undefined, "token", token);
		});
	}, []);

	return <authContext.Provider value={{ user, isLoggedIn: !!user }}>{children}</authContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(authContext);
	if (!context) throw new Error("useAuth must be used within a auth context provider");
	return context;
};
