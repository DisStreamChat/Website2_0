import { useRouter } from "next/router";
import Leveling from "./pluginPages/leveling";

const Plugins = () => {
	const router = useRouter();

	const [, serverId, pluginName] = router.query.type as string[];

	switch (pluginName) {
		case "leveling":
			return <Leveling />;
		default:
			return <></>;
	}
};

export default Plugins;
