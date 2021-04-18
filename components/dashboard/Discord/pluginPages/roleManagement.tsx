import { useContext, useEffect, useReducer, useState } from "react";
import { discordContext } from "../discordContext";
import styled from "styled-components";
import { H1, H2 } from "../../../shared/styles/headings";
import { Switch, TextField } from "@material-ui/core";
import { Action, role } from "../../../../utils/types";
import firebaseClient from "../../../../firebase/client";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { unset, get, set, isEqual, cloneDeep } from "lodash";
import { motion } from "framer-motion";
import StyledSelect from "../../../shared/styles/styled-select";
import RoleItem, { RoleOption } from "../RoleItem";
import { parseSelectValue, TransformObjectToSelectValue } from "../../../../utils/functions";
import SaveBar from "../../../shared/ui-components/SaveBar";

interface settingsBase {
	open: boolean;
}

interface DescriptionModel extends settingsBase {
	roles: { [id: string]: string };
}

interface JoinModel extends settingsBase {
	roles: role[];
}

interface RoleSettings {
	reactions: settingsBase;
	commands: settingsBase;
	join: JoinModel;
	descriptions: DescriptionModel;
}

const roleFactory = (): RoleSettings => {
	return {
		reactions: { open: false },
		commands: { open: false },
		join: { open: false, roles: [] },
		descriptions: { open: false, roles: {} },
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
	border-bottom: 1px solid #aaaaaa44;
	&:first-child {
		margin-top: 1rem;
	}
`;

const RoleSectionTitle = styled.div`
	padding: 1.5rem 0;
	display: flex;
	justify-content: space-between;
`;

const RoleSectionBody = styled(motion.div)`
	/* overflow: hidden; */
`;

const roleSectionVariants = {
	open: {
		height: "auto",
		overflow: "visible",
	},
	closed: {
		height: "0px",
		overflow: "hidden",
	},
};

const RoleSectionPadding = styled.div`
	padding: 0.5rem 0;
`;

const RoleSection: React.FC<sectionProps> = props => {
	return (
		<StyledRoleSection>
			<RoleSectionTitle>
				<h5>{props.title}</h5>
				<Switch
					color="primary"
					onChange={e => props.setOpen(e.target.checked)}
					checked={props.open}
				></Switch>
			</RoleSectionTitle>
			<RoleSectionBody
				variants={roleSectionVariants}
				animate={props.open ? "open" : "closed"}
			>
				<RoleSectionPadding>
					<div>{props.children}</div>
				</RoleSectionPadding>
			</RoleSectionBody>
		</StyledRoleSection>
	);
};

const actions = {
	UPDATE: "update",
	RESET: "reset",
	SET: "set",
	DELETE: "delete",
};

function deletePropertyPath(obj, path) {
	if (!obj || !path) {
		return;
	}

	if (typeof path === "string") {
		path = path.split(".");
	}

	for (var i = 0; i < path.length - 1; i++) {
		obj = obj[path[i]];

		if (typeof obj === "undefined") {
			return;
		}
	}

	delete obj[path.pop()];
}

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
		case actions.DELETE:
			const copy = cloneDeep(state);
			unset(copy, action.key);
			return copy;
	}
};

const DescriptionItem = styled.li`
	margin: 1rem 0 !important;
	display: flex;
	justify-content: space-between;
	gap: 2rem;
	max-width: 30%;
	align-items: center;
`;

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
		if (snapshot && Object.keys(snapshot).length) {
			console.log(snapshot);
			setLocalSettings(cloneDeep(snapshot));
			dispatch({ type: actions.SET, value: cloneDeep(snapshot) });
		} else {
			docRef.set({}, { merge: true });
		}
	}, [snapshot]);

	const changed = !isEqual(localSettings, { reactions, commands, join, descriptions });

	const notEveryone = roles.filter(role => role.name !== "@everyone");

	const notManaged = notEveryone.filter(role => !role.managed);

	const roleOptions = notEveryone.filter(
		role => descriptions?.roles?.[TransformObjectToSelectValue(role)] === undefined
	);

	const save = () => {
		docRef.update({ reactions, commands, join, descriptions });
	};

	return (
		<>
			<RoleSection
				title="Let your members get roles by reacting to a message"
				id="reactions"
				open={reactions.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "reactions.open", value: val });
				}}
			>
				<div style={{ height: "100px", background: "black" }}></div>
			</RoleSection>
			<RoleSection
				title="Let your members get roles with commands"
				id="commands"
				open={commands.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "commands.open", value: val });
				}}
			></RoleSection>
			<RoleSection
				title="Give members a role on join"
				id="join"
				open={join.open}
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "join.open", value: val });
				}}
			>
				<StyledSelect
					isMulti
					closeMenuOnSelect={false}
					placeholder="Select Roles"
					options={notManaged
						.filter(role => !join.roles.find(({ id }) => role.id == id))
						.map(role => ({
							value: TransformObjectToSelectValue(role),
							label: <RoleOption color={role.color}>{role.name}</RoleOption>,
						}))}
					onChange={options => {
						const transformedOptions = options.map(op => parseSelectValue(op, true));
						dispatch({
							type: actions.UPDATE,
							key: "join.roles",
							value: transformedOptions,
						});
					}}
					value={join.roles?.map(role => ({
						value: TransformObjectToSelectValue(role),
						label: <RoleOption {...role}>{role.name}</RoleOption>,
					}))}
				></StyledSelect>
			</RoleSection>
			<RoleSection
				title="Give descriptions to the roles in your server"
				open={descriptions.open}
				id="descriptions"
				setOpen={val => {
					dispatch({ type: actions.UPDATE, key: "descriptions.open", value: val });
				}}
			>
				<StyledSelect
					closeMenuOnSelect={true}
					placeholder="Add a role"
					options={roleOptions.map(role => ({
						value: TransformObjectToSelectValue(role),
						label: <RoleOption color={role.color}>{role.name}</RoleOption>,
					}))}
					onChange={option => {
						console.log(option);
						dispatch({
							type: actions.UPDATE,
							value: "",
							key: `descriptions.roles[${option.value}]`,
						});
					}}
					value={null}
				></StyledSelect>
				<H2 style={{ marginTop: "1rem" }}>
					Roles with descriptions - {roles.length - roleOptions.length - 1}
				</H2>
				<ul>
					{Object.entries(descriptions.roles || {})
						.sort()
						.map(([key, value]) => {
							const role = JSON.parse(key.split("=")[1]);
							return (
								<DescriptionItem>
									<RoleItem
										onClick={() =>
											dispatch({
												type: actions.DELETE,
												key: `descriptions.roles[${key}]`,
											})
										}
										{...role}
									>
										{role.name}
									</RoleItem>
									<TextField
										value={value}
										label="Description"
										variant="outlined"
										onChange={e =>
											dispatch({
												type: actions.UPDATE,
												value: e.target.value,
												key: `descriptions.roles[${key}]`,
											})
										}
									></TextField>
								</DescriptionItem>
							);
						})}
				</ul>
			</RoleSection>
			<SaveBar
				changed={changed}
				save={save}
				reset={() => dispatch({ type: actions.SET, value: cloneDeep(localSettings) })}
			></SaveBar>
		</>
	);
};

export default RoleManagement;
