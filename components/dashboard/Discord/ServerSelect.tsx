import { ServerSelectBody, ServerTitle } from "./styles";
import ServerItem from "./ServerItem";
import React from "react";
import { SmallLoader } from "../../shared/loader";

const ServerSelect = ({ servers }) => {
	return (
		<>
			<ServerTitle>Select a Server</ServerTitle>
			<ServerSelectBody>
				{servers ? (
					servers.map(server => <ServerItem key={server.id} {...server} />)
				) : (
					<SmallLoader loaded={false}></SmallLoader>
				)}
			</ServerSelectBody>
		</>
	);
};

export default ServerSelect;
