import styles from "./index.styles";
import Link from "next/link";
import Anchor from "../shared/ui-components/Anchor";
import { useMediaQuery } from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import { useEffect, useState } from "react";
import { PurpleButton } from "../shared/ui-components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useWindowScroll } from "react-use";

const Profile = () => {
	return <PurpleButton>Login</PurpleButton>;
};

const headerVariants = {
	top: {
		background: "rgba(23,24,27, 1)",
		color: "rgb(255, 255, 255)",
	},
	scrolled: {
		color: "rgb(255, 255, 255)",
		background: "rgba(23,24,27, 0)",
	},
};

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const useHamburger = useMediaQuery("(max-width: 900px)");
	const { y } = useWindowScroll();

	const router = useRouter();

	useEffect(() => {
		setMenuOpen(prev => prev && useHamburger);
	}, [useHamburger]);

	useEffect(() => {
		setMenuOpen(false);
	}, [router.pathname]);

	const links = (
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
				<Anchor newTab href="https://discord.disstreamchat.com">
					Community
				</Anchor>
			</styles.navItem>
			<styles.navItem>
				<Anchor newTab href="https://www.patreon.com/disstreamchat?fan_landing=true">
					Support Us
				</Anchor>
			</styles.navItem>
			<styles.navItem>
				<Link href="/dashboard">
					<a>Dashboard</a>
				</Link>
			</styles.navItem>
		</>
	);

	return (
		<styles.Header
			// variants={headerVariants}
			// transition={{ duration: 0.5, ease: "easeInOut" }}
			// animate={y > 80 ? "scrolled" : "top"}
		>
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
				{!useHamburger && links}
				<styles.navItem>
					{useHamburger ? (
						<div className="hamburger-holder">
							<HamburgerMenu
								isOpen={menuOpen}
								menuClicked={() => setMenuOpen(u => !u)}
								strokeWidth={5}
								rotate={0}
								color="white"
								borderRadius={5}
								animationDuration={0.5}
							/>
						</div>
					) : (
						<Profile />
					)}
				</styles.navItem>
			</styles.nav>
			<AnimatePresence>
				{menuOpen && (
					<styles.sidebar
						key="sidebar"
						exit={{ x: 900, opacity: 0 }}
						initial={{ x: 900, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.25 }}
					>
						{links}
					</styles.sidebar>
				)}
			</AnimatePresence>
		</styles.Header>
	);
};

export default Header;
