import styles from "./index.styles";
import Link from "next/link";
import Anchor from "../shared/ui-components/Anchor";
import {
	Avatar,
	ClickAwayListener,
	createStyles,
	makeStyles,
	Theme,
	useMediaQuery,
} from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import React, { useEffect, useState } from "react";
import {
	BlueButton,
	PurpleButton,
	TwitchButton,
	DiscordButton,
} from "../shared/ui-components/Button";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useWindowScroll } from "react-use";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Zoom from "@material-ui/core/Zoom";
import { useHeaderContext } from "./context";
import { useAuth } from "../../auth/authContext";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import firebaseClient from "../../firebase/client";

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

const Profile = () => {
	const { setLoginModalOpen } = useHeaderContext();
	const { user, isLoggedIn } = {
		user: {
			name: "David",
			profilePicture:
				"https://static-cdn.jtvnw.net/jtv_user_pictures/b308a27a-1b9f-413a-b22b-3c9b2815a81a-profile_image-300x300.png",
		},
		isLoggedIn: true,
	};

	const [profileMenuOpen, setProfileMenuOpen] = useState(false);

	useEffect(() => {
		setProfileMenuOpen(prev => prev && !!isLoggedIn);
	}, [isLoggedIn]);

	return !user ? (
		<PurpleButton
			onClick={() => {
				setLoginModalOpen(true);
			}}
		>
			Login
		</PurpleButton>
	) : (
		<styles.UserProfile onClick={() => setProfileMenuOpen(true)}>
			<Avatar src={user.profilePicture}>
				<AccountCircleIcon />
			</Avatar>
			<styles.Username>{user.name}</styles.Username>
			<styles.Chevron animate={profileMenuOpen ? { rotate: 180 } : { rotate: 0 }}>
				<KeyboardArrowDownIcon />
			</styles.Chevron>
			<AnimatePresence>
				{profileMenuOpen && (
					<ClickAwayListener onClickAway={() => setProfileMenuOpen(false)}>
						<styles.menuDropDown
							exit={{ y: -50, opacity: 0 }}
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 15, opacity: 1 }}
							transition={{
								staggerChildren: 0.1,
								when: "beforeChildren",
							}}
						>
							<styles.menuItem tabIndex={-1}>
								<Link href="/dashboard">
									<a>My Dashboard</a>
								</Link>
							</styles.menuItem>
							<styles.menuItem>Edit my personal rank card</styles.menuItem>
							<styles.menuItem
								onClick={async () => {
									await firebaseClient.logout();
									setProfileMenuOpen(false);
								}}
								warn
							>
								Logout
							</styles.menuItem>
						</styles.menuDropDown>
					</ClickAwayListener>
				)}
			</AnimatePresence>
		</styles.UserProfile>
	);
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
			<styles.navItem tabIndex={-1}>
				<Link href="/apps/download">
					<a>Chat Manager</a>
				</Link>
			</styles.navItem>
			<styles.navItem tabIndex={-1}>
				<Link href="/bot">
					<a>Discord Bot</a>
				</Link>
			</styles.navItem>
			<styles.navItem tabIndex={-1}>
				<Anchor newTab href="https://discord.disstreamchat.com">
					Community
				</Anchor>
			</styles.navItem>
			<styles.navItem tabIndex={-1}>
				<Anchor newTab href="https://www.patreon.com/disstreamchat?fan_landing=true">
					Support Us
				</Anchor>
			</styles.navItem>
			{isLoggedIn && (
				<styles.navItem tabIndex={-1}>
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
							<TwitchButton type="submit">
								<Anchor
									href={
										acceptedTerms
											? "https://id.twitch.tv/oauth2/authorize?client_id=ip3igc72c6wu7j00nqghb24duusmbr&redirect_uri=https://www.disstreamchat.com&response_type=code&scope=openid%20moderation:read%20chat:edit%20chat:read%20channel:moderate%20channel:read:redemptions%20user_subscriptions"
											: null
									}
								>
									Twitch
								</Anchor>
							</TwitchButton>
							<DiscordButton type="submit">
								<Anchor
									href={
										acceptedTerms
											? "https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=https://www.disstreamchat.com%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20guilds"
											: null
									}
								>
									Discord
								</Anchor>
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
							src="https://www.disstreamchat.com/logo.png"
							alt="logo"
						/>
					</a>
				</Link>
			</styles.logo>
			<styles.nav>
				{!useHamburger && links}
				<styles.NavItem tabIndex={-1}>
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
						<Profile />
					</styles.sidebar>
				)}
			</AnimatePresence>
		</styles.Header>
	);
};

export default Header;
