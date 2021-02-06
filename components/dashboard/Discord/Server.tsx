import React from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import styled from "styled-components";
import { useRouter } from "next/router";
import Plugins from "./Plugins";

const PluginBody = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
	gap: 25px;
	-webkit-box-pack: center;
	justify-content: center;
`;

const Server = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	return (
		<>
			{!pluginName ? (
				<PluginBody>
					{plugins.map(plugin => (
						<PluginItem
							key={plugin.id}
							serverId={serverId}
							{...plugin}
							active={false}
						/>
					))}
				</PluginBody>
			) : (
				<Plugins />
			)}
		</>
	);
};

export default Server;
