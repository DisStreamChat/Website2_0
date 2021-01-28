import GuildIcon from "../../shared/styles/guildIcon";
import { H3, H2 } from "../../shared/styles/headings";
import { BlueButton } from "../../shared/ui-components/Button";
import { ServerItemBody } from "./styles";
import Link from "next/link";
import { useMediaQuery } from "@material-ui/core";
import Anchor from "../../shared/ui-components/Anchor";

interface ServerProps {
	id: string;
	name: string;
	icon?: string;
	botIn?: boolean;
}

const ServerItem = ({ id, name, icon, botIn }: ServerProps) => {
	const smallScreen = useMediaQuery("(max-width: 425px)");

	return (
		<ServerItemBody>
			<GuildIcon size={smallScreen ? 64 : 128} id={id} icon={icon} name={name} />
			<div>
				<H2>{name}</H2>
				<BlueButton tabIndex={-1}>
					{botIn ? (
						<Link href={`discord/${id}`}>
							<a>Manage</a>
						</Link>
					) : (
						<Anchor href="https://invite.disstreamchat.com" newTab>
							Invite
						</Anchor>
					)}
				</BlueButton>
			</div>
		</ServerItemBody>
	);
};

export default ServerItem;
