import styles from "./index.styles";
import Link from "next/link";
import { Avatar, ClickAwayListener, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { EmptyButton, PurpleButton } from "../shared/ui-components/Button";
import { AnimatePresence } from "framer-motion";
import { useHeaderContext } from "./context";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import firebaseClient from "../../firebase/client";
import { useAuth, User } from "../../auth/authContext";
import { useRouter } from "next/router";
import RankCardModal from "./rankCardModal";

export const useProfile = () => {
	const { setLoginModalOpen } = useHeaderContext();
	const { user, isLoggedIn } = useAuth();
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	return { setLoginModalOpen, user, isLoggedIn, profileMenuOpen, setProfileMenuOpen };
};

interface profileProps {
	user: User;
	setProfileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	profileMenuOpen: boolean;
	setLoginModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StyledProfile = ({
	user,
	profileMenuOpen,
	setProfileMenuOpen,
	setLoginModalOpen,
}: profileProps) => {
	const router = useRouter();
	const smallScreen = useMediaQuery("(max-width: 900px)");
	const [modalOpen, setModalOpen] = useState(false);

	const yLoc = smallScreen ? -250 : 15;

	return !user ? (
		<PurpleButton
			onClick={() => {
				setLoginModalOpen(true);
			}}
		>
			Login
		</PurpleButton>
	) : (
		<>
			<styles.UserProfile onClick={() => setProfileMenuOpen(true)}>
				<Avatar
					imgProps={{
						alt: "avatar",
					}}
					src={user.profilePicture}
				>
					<AccountCircleIcon />
				</Avatar>
				<styles.Username>{user.displayName}</styles.Username>
				<styles.Chevron animate={profileMenuOpen ? { rotate: 180 } : { rotate: 0 }}>
					<KeyboardArrowDownIcon />
				</styles.Chevron>
				<AnimatePresence>
					{profileMenuOpen && (
						<ClickAwayListener onClickAway={() => setProfileMenuOpen(false)}>
							<styles.menuDropDown
								exit={{ y: -50, opacity: 0 }}
								initial={{ y: -50, opacity: 0 }}
								animate={{ y: yLoc, opacity: 1 }}
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
								{user.discordId && (
									<styles.menuItem onClick={() => setModalOpen(true)}>
										Edit my personal rank card
									</styles.menuItem>
								)}
								<styles.menuItem tabIndex={-1}>
									<Link href="/account">
										<a>My Account</a>
									</Link>
								</styles.menuItem>
								<styles.menuItem
									onClick={async () => {
										await firebaseClient.logout();
										setProfileMenuOpen(false);
										if (router.asPath.includes("dashboard")) {
											router.push("/");
										}
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
			<RankCardModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	);
};

export const DashboardProfile = ({ user }) => {
	const { profileMenuOpen, setProfileMenuOpen } = useProfile();

	return (
		<StyledProfile
			user={user}
			profileMenuOpen={profileMenuOpen}
			setProfileMenuOpen={setProfileMenuOpen}
		/>
	);
};

const Profile = () => {
	const {
		setLoginModalOpen,
		user,
		isLoggedIn,
		profileMenuOpen,
		setProfileMenuOpen,
	} = useProfile();

	useEffect(() => {
		setProfileMenuOpen(prev => prev && !!isLoggedIn);
	}, [isLoggedIn]);

	return (
		<StyledProfile
			user={user}
			profileMenuOpen={profileMenuOpen}
			setProfileMenuOpen={setProfileMenuOpen}
			setLoginModalOpen={setLoginModalOpen}
		/>
	);
};

export default Profile;
