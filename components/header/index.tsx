import styles from "./index.styles";
import Link from "next/link";
import Anchor from "../shared/ui-components/Anchor";
import { createStyles, makeStyles, Theme, useMediaQuery } from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import React, { useEffect, useState } from "react";
import { TwitchButton, DiscordButton } from "../shared/ui-components/Button";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useWindowScroll } from "react-use";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Zoom from "@material-ui/core/Zoom";
import { useHeaderContext } from "./context";
import { useAuth } from "../../auth/authContext";
import dynamic from "next/dynamic";
import { redirect_uri } from "../../utils/constants";
import { redirect } from "next/dist/next-server/server/api-utils";
const Profile = dynamic(() => import("./Profile"));
const Sidebar = dynamic(() => import("./sidebar"));

const headerVariants = {
	top: {
		background: "rgba(0, 0, 0, 1)",
		color: "rgb(255, 255, 255)",
	},
	scrolled: {
		color: "rgb(255, 255, 255)",
		background: "rgba(0, 0, 0, 0)",
	},
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: "2px solid #000",
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	})
);

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const useHamburger = useMediaQuery("(max-width: 900px)");
	const { y } = useWindowScroll();
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const { loginModalOpen, setLoginModalOpen } = useHeaderContext();

	const { isLoggedIn } = useAuth();

	const router = useRouter();

	useEffect(() => {
		setMenuOpen(prev => prev && useHamburger);
	}, [useHamburger]);

	useEffect(() => {
		document.body.style.overflowY = menuOpen ? "hidden" : "auto";
	}, [menuOpen]);

	useEffect(() => {
		setMenuOpen(false);
		setLoginModalOpen(false);
	}, [router.pathname]);

	const links = (
		<>
			<styles.navItem name="Chat Manager">
				<Link href="/apps/download">
					<a>Chat Manager</a>
				</Link>
			</styles.navItem>
			<styles.navItem name="Discord Bot">
				<Link href="/bot">
					<a>Discord Bot</a>
				</Link>
			</styles.navItem>
			<styles.navItem name="Community">
				<Anchor newTab href="https://discord.disstreamchat.com">
					Community
				</Anchor>
			</styles.navItem>
			<styles.navItem name="Support Us">
				<Anchor newTab href="https://www.patreon.com/disstreamchat?fan_landing=true">
					Support Us
				</Anchor>
			</styles.navItem>
			{isLoggedIn && (
				<styles.navItem name="Dashboard">
					<Link href="/dashboard">
						<a>Dashboard</a>
					</Link>
				</styles.navItem>
			)}
		</>
	);

	const classes = useStyles();

	return (
		<styles.Header
		// variants={headerVariants}
		// transition={{ duration: 0.5, ease: "easeInOut" }}
		// animate={y > 80 ? "scrolled" : "top"}
		>
			<Modal
				aria-labelledby="login-modal"
				aria-describedby="login-modal"
				open={loginModalOpen}
				onClose={() => setLoginModalOpen(false)}
				BackdropComponent={Backdrop}
				className={classes.modal}
			>
				<Zoom in={loginModalOpen}>
					<styles.loginModal>
						<form
							onSubmit={e => {
								e.preventDefault();
							}}
						>
							<styles.modalHeading>Login to DisStreamChat</styles.modalHeading>
							<styles.modalSubHeading>Connect with:</styles.modalSubHeading>
							<TwitchButton
								type="submit"
								onClick={() => {
									if (!acceptedTerms) return;

									window.open(
										`https://id.twitch.tv/oauth2/authorize?client_id=ip3igc72c6wu7j00nqghb24duusmbr&redirect_uri=${redirect_uri}&response_type=code&scope=openid%20moderation:read%20chat:edit%20chat:read%20channel:moderate%20channel:read:redemptions%20user_subscriptions`,
										"twitch",
										"height=775,width=500"
									);
								}}
							>
								Twitch
							</TwitchButton>

							<DiscordButton
								type="submit"
								onClick={() => {
									if (!acceptedTerms) return;
									window.open(
										`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=${encodeURIComponent(
											redirect_uri
										)}${encodeURIComponent(
											"?discord=true"
										)}&response_type=code&scope=identify%20guilds`,
										"discord",
										"height=775,width=500"
									);
								}}
							>
								Discord
							</DiscordButton>
							<styles.legal>
								<input
									checked={acceptedTerms}
									onChange={e => setAcceptedTerms(e.target.checked)}
									type="checkbox"
									name="terms"
									required
								/>
								<span>
									I accept the{" "}
									<Link href="/terms">
										<a>terms and conditions</a>
									</Link>{" "}
									and{" "}
									<Link href="/privacy">
										<a>privacy policy</a>
									</Link>
								</span>
							</styles.legal>
						</form>
					</styles.loginModal>
				</Zoom>
			</Modal>
			<styles.logo>
				<Link href="/">
					<a tabIndex={0}>
						<img
							width="50"
							height="50"
							src="/medium_logo.webp"
							alt="DisStreamChat Logo"
						/>
					</a>
				</Link>
			</styles.logo>
			<styles.nav>
				{!useHamburger && links}
				<styles.NavItem>
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
				</styles.NavItem>
			</styles.nav>
			<AnimatePresence>{menuOpen && <Sidebar>{links}</Sidebar>}</AnimatePresence>
		</styles.Header>
	);
};

export default Header;
