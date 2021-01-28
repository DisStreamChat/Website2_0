import { ServerSelectBody, ServerTitle } from "./styles";
import ServerItem from "./ServerItem";

const servers = [
	{
		id: "711238743213998091",
		// icon: "0abf1a3a68c1be1c4ccde1e208d1e2db",
		name: "DisStreamChat Community",
		botIn: true,
	},
	{
		id: "711238743213998091",
		icon: "0abf1a3a68c1be1c4ccde1e208d1e2db",
		name: "DisStreamChat Community",
		botIn: true,
	},
	{
		id: "711238743213998091",
		icon: "0abf1a3a68c1be1c4ccde1e208d1e2db",
		name: "DisStreamChat Community",
		botIn: true,
	},
];

const ServerSelect = () => {
	return (
		<>
			<ServerTitle>Select a Server</ServerTitle>
			<ServerSelectBody>
				{servers.map(server => (
					<ServerItem {...server} />
				))}
			</ServerSelectBody>
		</>
	);
};

export default ServerSelect;
