import { useRouter } from "next/router";
import CustomCommands from "./pluginPages/customCommands";
import Leveling from "./pluginPages/leveling";
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
		default:
			return <></>;
	}
};

export default Plugins;
