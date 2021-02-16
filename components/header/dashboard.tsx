import styles from "./index.styles";
import Link from "next/link";
import styled from "styled-components";
import { Vr } from "../shared/styles";
import React, { useEffect, useState } from "react";
import Anchor from "../shared/ui-components/Anchor";
import { DashboardProfile } from "./Profile";
import { useRouter } from "next/router";
import DropdownSelect from "./dropdownSelect";
import { useMediaQuery } from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("./sidebar"));

const Header = styled(styles.Header)`
	display: flex;
	justify-content: center;
`;

const HeaderContent = styled.div`
	width: 80%;
	display: flex;
`;

const Logo = styled(styles.logo)`
	margin-right: 30px;
`;
const VerticalRule = styled(Vr)`
	margin: 0.5rem 0;
`;

const DashboardHeader = ({ user, serverId = "" }) => {
	const router = useRouter();

	const useHamburger = useMediaQuery("(max-width: 900px)");

	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		setMenuOpen(prev => prev && useHamburger);
	}, [useHamburger]);

	useEffect(() => {
		document.body.style.overflowY = menuOpen ? "hidden" : "auto";
	}, [menuOpen]);

	const links = (
		<>
			<styles.navItem
				overrideUnderline={
					router.query?.type[0] === "discord" && router.query?.type?.length == 1
				}
				name="Discord"
			>
				<Link href="/dashboard/discord">
					<a>Discord</a>
				</Link>
			</styles.navItem>
			<styles.navItem overrideUnderline={router.query?.type[0] === "app"} name="app">
				<Link href="app">
					<a>app</a>
				</Link>
			</styles.navItem>
			{router.query?.type?.[0] === "discord" && serverId && (
				<>
					<styles.navItem
						overrideUnderline={router.asPath.includes("leaderboard")}
						name="Leaderboard"
					>
						<Link href={`${router.asPath}/leaderboard`}>
							<a>Leaderboard</a>
						</Link>
					</styles.navItem>
					<DropdownSelect
						title="Plugins"
						items={[
							{ name: "leveling", link: "/leveling", local: true },
							{ name: "leveling", link: "/leveling", local: true },
							{ name: "leveling", link: "/leveling", local: true },
							{ name: "leveling", link: "/leveling", local: true },
							{ name: "leveling", link: "/leveling", local: true },
						]}
					/>
				</>
			)}
		</>
	);

	return (
		<Header>
			<HeaderContent>
				<Logo>
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
				</Logo>
				<>
					{!useHamburger && <VerticalRule />}
					<styles.nav>
						{!useHamburger && links}
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
							<DashboardProfile user={user} />
						)}
					</styles.nav>
					<AnimatePresence>{menuOpen && <Sidebar>{links}</Sidebar>}</AnimatePresence>
				</>
			</HeaderContent>
		</Header>
	);
};

export default DashboardHeader;
