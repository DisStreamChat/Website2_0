import { useRouter } from "next/router";
import CustomCommands from "./pluginPages/customCommands";
import Leveling from "./pluginPages/leveling";
import Logging from "./pluginPages/logging";
import RoleManagement from "./pluginPages/roleManagement";
import Welcome from "./pluginPages/welcome";

const Plugins = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	switch (pluginName) {
		case "leveling":
			return <Leveling />;
		case "commands":
			return <CustomCommands/>
		case "welcome-message": 
			return <Welcome/>
		case "logging":
			return <Logging/>
		case "roles":
			return <RoleManagement/>
		default:
			return <></>;
	}
};

export default Plugins;
