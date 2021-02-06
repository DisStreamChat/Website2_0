import React from "react";
import PluginItem from "./PluginItem";
import plugins from "../../../utils/plugins.json";
import styled from "styled-components";

const ServerBody = styled.div`
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: 25px;
    -webkit-box-pack: center;
    justify-content: center;
`;

const Server = ({serverId=""}) => {
	return (
		<ServerBody>
			{plugins.map(plugin => (
				<PluginItem key={plugin.id} serverId={serverId} {...plugin} active={false} />
			))}
		</ServerBody>
	);
};

export default Server;
