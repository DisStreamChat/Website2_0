import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { H2, H3 } from "../../../shared/styles/headings";
import { BlueButton } from "../../../shared/ui-components/Button";
import { PluginSubHeader } from "./styles";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebaseClient from "../../../../firebase/client";
import ListItem from "../../../shared/ui-components/ListItem";
import { isEqual } from "lodash";
import SaveBar from "../../../shared/ui-components/SaveBar";

const CommandsHeader = styled(PluginSubHeader)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	align-items: flex-start;
	& > * + * {
		margin-top: 1rem;
		margin-left: 0;
	}
`;

export interface command {
	DM?: boolean;
	allowedChannels: string[];
	bannedRoles: string[];
	cooldown: number;
	cooldownTime: number;
	deleteUsage?: boolean;
	description: string;
	lastUsed: number;
	message: string;
	name: string;
	permittedRoles: string[];
	role: false;
	type: string;
}

interface commandMap {
	[key: string]: command;
}

const CustomCommands = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];
	const [localCommands, setLocalCommands] = useState<commandMap>({});

	const collectionRef = firebaseClient.db.collection("customCommands");

	const [snapshot, loading, error] = useDocumentData(collectionRef.doc(serverId));

	useEffect(() => {
		if (!snapshot) {
			collectionRef.doc(serverId).set({}, { merge: true });
		} else {
			console.log("setting local commands");
			setLocalCommands(snapshot);
		}
	}, [snapshot]);

	const commands: [string, command][] = Object.entries(localCommands || {})
		.filter(([key, val]) => val.type === "text")
		.sort();

	const changed = !isEqual(snapshot, localCommands);

	const deleteMe = key => {
		setLocalCommands(prev => {
			const copy = { ...prev };
			delete copy[key];
			return copy;
		});
	};

	const save = () => {
		collectionRef.doc(serverId).set(localCommands);
	}

	return (
		<div>
			<CommandsHeader>
				<span>
					<H2>Text Command</H2>
					<h4>A simple command that responds with a custom message in DM or public</h4>
				</span>
				<span>
					<BlueButton>Create Command</BlueButton>
				</span>
			</CommandsHeader>
			<span>
				<H2>Commands - {commands?.length}</H2>
				<ul>
					{snapshot &&
						commands.map(([key, val]) => (
							<ListItem delete={() => deleteMe(key)} edit={() => {}}>
								<div>
									<img src="/speech.svg" alt="" width="50" />
								</div>
								<div>
									<H3>{key}</H3>
									<div>{val.description}</div>
								</div>
							</ListItem>
						))}
				</ul>
			</span>
			<SaveBar changed={changed} save={save} reset={() => setLocalCommands(snapshot)} />
		</div>
	);
};

export default CustomCommands;
