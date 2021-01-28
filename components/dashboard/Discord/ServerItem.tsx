import GuildIcon from "../../shared/styles/guildIcon";
import { H3, H2 } from "../../shared/styles/headings";
import { BlueButton } from "../../shared/ui-components/Button";
import { ServerItemBody } from "./styles";

interface ServerProps{
	id: string,
	name: string,
	icon?: string,
	botIn?: boolean
}

const ServerItem = ({ id, name, icon, botIn }: ServerProps) => {
	return (
		<ServerItemBody>
			<GuildIcon size={128} id={id} icon={icon} name={name} />
			<div>
				<H2>{name}</H2>
				<BlueButton>Manage</BlueButton>
			</div>
		</ServerItemBody>
	);
};

export default ServerItem;
