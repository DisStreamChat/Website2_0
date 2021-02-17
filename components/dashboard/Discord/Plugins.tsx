import { useRouter } from "next/router";
import CustomCommands from "./pluginPages/customCommands";
import Leveling from "./pluginPages/leveling";

const Plugins = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	switch (pluginName) {
		case "leveling":
			return <Leveling />;
		case "commands":
			return <CustomCommands/>
		default:
			return <></>;
	}
};

export default Plugins;
