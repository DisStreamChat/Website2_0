import GuildIcon from "../../shared/styles/guildIcon";
import { H3, H2 } from "../../shared/styles/headings";
import { BlueButton } from "../../shared/ui-components/Button";
import { ServerItemBody } from "./styles";
import Link from "next/link"
import { useMediaQuery } from "@material-ui/core";


interface ServerProps {
	id: string;
	name: string;
	icon?: string;
	botIn?: boolean;
}

const ServerItem = ({ id, name, icon, botIn }: ServerProps) => {

	const smallScreen = useMediaQuery("(max-width: 425px)")

	return (
		<ServerItemBody>
			<GuildIcon size={smallScreen ? 64 : 128} id={id} icon={icon} name={name} />
			<div>
				<H2>{name}</H2>
				<BlueButton>
					<Link href="">
						<a>Manage</a>
					</Link>{" "}
				</BlueButton>
			</div>
		</ServerItemBody>
	);
};

export default ServerItem;
