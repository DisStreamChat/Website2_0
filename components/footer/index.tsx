import { H3, H4 } from "../shared/styles/headings";
import Anchor from "../shared/ui-components/Anchor";
import styles from "./index.styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import Link from "next/link";

const Footer = () => {
	return (
		<styles.footer>
			<styles.top>
				<styles.left>
					<H3>The best Stream/Discord chat integration</H3>
					<styles.h4>
						DisStreamChat is the easiest way to link your Discord with your Stream chat
					</styles.h4>
					<styles.icons>
						<Anchor aria-label="Github" href="https://github.com/DisStreamChat">
							<GitHubIcon />
						</Anchor>
						<Anchor aria-label="Twitter" href="https://twitter.com/DisStreamChat">
							<TwitterIcon />
						</Anchor>
					</styles.icons>
				</styles.left>
				<styles.right>
					<styles.column>
						<styles.heading>Products</styles.heading>
						<Link href="/bot" passHref>
							<Anchor>Use the Discord bot</Anchor>
						</Link>
						<Link href="/apps/download" passHref>
							<Anchor>Get the Chat Client</Anchor>
						</Link>
						<Anchor
							href="https://www.patreon.com/disstreamchat?fan_landing=true"
							newTab
						>
							Support us on Patreon
						</Anchor>
					</styles.column>
					<styles.column>
						<styles.heading>Resources</styles.heading>
						<Anchor
							href="https://discord.disstreamchat.com"
							newTab
						>
							Join the Discord
						</Anchor>
						<Link href="/terms" passHref>
							<Anchor>Terms of Service</Anchor>
						</Link>
						<Link href="/privacy" passHref>
							<Anchor>Privacy Policy</Anchor>
						</Link>
					</styles.column>
					<styles.column>
						<styles.heading>Team</styles.heading>
						<Link href="/members" passHref>
							<Anchor>Members</Anchor>
						</Link>

						<Anchor href="https://github.com/DisStreamChat/Contributors" newTab>
							Contributors
						</Anchor>
					</styles.column>
				</styles.right>
			</styles.top>
			<styles.bottom>
				<Anchor
					href="https://github.com/DisStreamChat/Website/blob/master/LICENSE"
					newTab
					className="copyright"
				>
					© DisStreamChat 2020-2021
				</Anchor>
				<span className="made-by">
					Made with ❤ by the{" "}
					<Anchor href="https://github.com/orgs/DisStreamChat/people" newTab>
						DisStreamChat Team
					</Anchor>
				</span>
			</styles.bottom>
		</styles.footer>
	);
};

export default Footer;
