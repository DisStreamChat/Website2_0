import { ServerSelectBody, ServerTitle } from "./styles";
import ServerItem from "./ServerItem";

const ServerSelect = ({servers}) => {
	return (
		<>
			<ServerTitle>Select a Server</ServerTitle>
			<ServerSelectBody>
				{servers.map(server => (
					<ServerItem key={server.id} {...server} />
				))}
			</ServerSelectBody>
		</>
	);
};

export default ServerSelect;
