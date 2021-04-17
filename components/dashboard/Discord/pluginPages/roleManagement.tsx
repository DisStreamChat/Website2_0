import { useContext, useEffect, useReducer, useState } from "react";
import { discordContext } from "../discordContext";
import styled from "styled-components";
import { H1 } from "../../../shared/styles/headings";
import { Switch } from "@material-ui/core";
import { Action } from "../../../../utils/types";
import firebaseClient from "../../../../firebase/client";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { get, set, isEqual, cloneDeep } from "lodash";

interface settingsBase {
	open: boolean
}

interface RoleSettings {
	reactions: settingsBase;
	commands: settingsBase;
	join: settingsBase;
	descriptions: settingsBase;
}

const roleFactory = (): RoleSettings => {
	return {
		reactions: { open: false },
		commands: { open: false },
		join: { open: false },
		descriptions: { open: false },
	};
};

interface sectionProps {
	id: string;
	title: string;
	open?: boolean;
	setOpen?: (val: boolean) => void;
}

const StyledRoleSection = styled.section`
	h5 {
		color: rgb(255, 255, 255);
		font-weight: 600;
		font-size: 16px;
	}
	border-top: 1px solid #aaaaaa44;
	&:first-child {
		margin-top: 1rem;
	}
`;

const RoleSectionTitle = styled.div`
	padding: 1.5rem 0;
	display: flex;
	justify-content: space-between;
`;

const RoleSection: React.FC<sectionProps> = props => {
	return (
		<StyledRoleSection>
			<RoleSectionTitle>
				<h5>{props.title}</h5>
				<Switch color="primary" onChange={e => props.setOpen(e.target.checked)} checked={props.open}></Switch>
			</RoleSectionTitle>
			<div>{props.children}</div>
		</StyledRoleSection>
	);
};

const actions = {
	UPDATE: "update",
	RESET: "reset",
	SET: "set",
};

const settingsReducer = (state: RoleSettings, action: Action) => {
	switch (action.type) {
		case actions.UPDATE:
			const obj = set(
				{ ...state },
				action.key,
				typeof action.value === "function"
					? action.value(get(state, action.key))
					: action.value
			);
			return obj;
		case actions.RESET:
			return roleFactory();
		case actions.SET:
			return action.value;
	}
};

const collections = ["reactions", "commands", "join", "descriptions"];

const RoleManagement = () => {
	const router = useRouter();

	const [, serverId] = router.query.type as string[];

	const { roles, allChannels, emotes } = useContext(discordContext);
	const [{ reactions, commands, join, descriptions }, dispatch] = useReducer<
		(state: RoleSettings, action: Action) => RoleSettings,
		RoleSettings
	>(settingsReducer, roleFactory(), roleFactory);
	const [localSettings, setLocalSettings] = useState(() => roleFactory());

	const docRef = firebaseClient.db.collection("roleManagement").doc(serverId);

	const [snapshot] = useDocumentData(docRef);

	useEffect(() => {
		if (snapshot) {
			setLocalSettings(cloneDeep(snapshot));
		} else {
			docRef.set({}, { merge: true });
		}
	}, []);


	return (
		<>
			<RoleSection
				title="Let your members get roles by reacting to a message"
				id="reactions"
				open={reactions.open}
				setOpen={(val) => {
					dispatch({ type: actions.UPDATE, key: "reactions.open", value: val });
				}}
			></RoleSection>
			<RoleSection
				title="Let your members get roles with commands"
				id="commands"
				open={commands.open}
				setOpen={(val) => {
					dispatch({ type: actions.UPDATE, key: "commands.open", value: val });
				}}
			></RoleSection>
			<RoleSection
				title="Give members a role on join"
				id="join"
				open={join.open}
				setOpen={(val) => {
					dispatch({ type: actions.UPDATE, key: "join.open", value: val });
				}}
			></RoleSection>
			<RoleSection
				title="Give descriptions to the roles in your server"
				open={descriptions.open}
				id="descriptions"
				setOpen={(val) => {
					dispatch({ type: actions.UPDATE, key: "descriptions.open", value: val });
				}}
			></RoleSection>
		</>
	);
};

export default RoleManagement;
