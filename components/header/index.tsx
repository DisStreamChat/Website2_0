import styles from "./index.styles";
import Link from "next/link";
import Anchor from "../shared/ui-components/Anchor";
import { useMediaQuery } from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import { useState } from "react";
import {PurpleButton} from "../shared/ui-components/Button"

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const useHamburger = useMediaQuery("(max-width: 900px)");

	return (
		<styles.Header>
			<styles.logo>
				<Link href="/">
					<a>
						<img
							width="50"
							height="50"
							src="https://www.disstreamchat.com/logo.png"
							alt="logo"
						/>
					</a>
				</Link>
			</styles.logo>
			<styles.nav>
				{!useHamburger && (
					<>
						<styles.navItem>
							<Link href="/apps/download">
								<a>Chat Manager</a>
							</Link>
						</styles.navItem>
						<styles.navItem>
							<Link href="/bot">
								<a>Discord Bot</a>
							</Link>
						</styles.navItem>
						<styles.navItem>
							<Link href="/community">
								<a>Community</a>
							</Link>
						</styles.navItem>
						<styles.navItem>
							<Anchor
								newTab
								href="https://www.patreon.com/disstreamchat?fan_landing=true"
							>
								Support Us
							</Anchor>
						</styles.navItem>
						<styles.navItem>
							<Link href="/dashboard">
								<a>Dashboard</a>
							</Link>
						</styles.navItem>
					</>
				)}
				<styles.navItem>
					{useHamburger ? (
						<div className="hamburger-holder">
							<HamburgerMenu
								isOpen={menuOpen}
								menuClicked={() => setMenuOpen(u => !u)}
								strokeWidth={3}
								rotate={0}
								color="white"
								borderRadius={5}
								animationDuration={0.5}
							/>
						</div>
					) : (
						<PurpleButton>Login</PurpleButton>
					)}
				</styles.navItem>
			</styles.nav>
		</styles.Header>
	);
};

export default Header;
