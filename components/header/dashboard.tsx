import styles from "./index.styles";
import Link from "next/link";
import styled from "styled-components";
import { Vr } from "../shared/styles";
import React from "react";
import Anchor from "../shared/ui-components/Anchor";
import { DashboardProfile } from "./Profile";
import { useRouter } from "next/router";
import DropdownSelect from "./dropdownSelect";
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
				<VerticalRule />
				<styles.nav>
					<styles.navItem
						overrideUnderline={
							router.query?.type[0] === "discord" && router.query?.type?.length == 1
						}
						name="Discord"
					>
						<Link href="discord">
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
					<DashboardProfile user={user} />
				</styles.nav>
			</HeaderContent>
		</Header>
	);
};

export default DashboardHeader;
