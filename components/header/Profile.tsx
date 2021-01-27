import styles from "./index.styles";
import Link from "next/link";
import {
	Avatar,
	ClickAwayListener,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
	PurpleButton,
} from "../shared/ui-components/Button";
import { AnimatePresence } from "framer-motion";
import { useHeaderContext } from "./context";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import firebaseClient from "../../firebase/client";

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
			<Avatar
				imgProps={{
					alt: "avatar",
				}}
				src={user.profilePicture}
			>
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
							<styles.menuItem>
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

export default Profile;
