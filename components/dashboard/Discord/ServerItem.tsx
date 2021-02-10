import GuildIcon from "../../shared/styles/guildIcon";
import { H3, H2 } from "../../shared/styles/headings";
import { BlueButton, PaddingButton } from "../../shared/ui-components/Button";
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

	const Button = botIn ? BlueButton : PaddingButton;

	return (
		<ServerItemBody>
			<GuildIcon size={smallScreen ? 64 : 128} id={id} icon={icon} name={name} />
			<div>
				<H2>{name}</H2>
				{botIn ? (
					<Link href={`discord/${id}`}>
						<a>
							<Button tabIndex={-1}>Manage</Button>
						</a>
					</Link>
				) : (
					<Anchor href="https://invite.disstreamchat.com" newTab>
						<Button tabIndex={-1}>Invite</Button>
					</Anchor>
				)}
			</div>
		</ServerItemBody>
	);
};

export default ServerItem;
