import styles from "./index.styles";
import Link from "next/link";
import styled from "styled-components";
import { Vr } from "../shared/styles";
import React from "react";
import Anchor from "../shared/ui-components/Anchor";
import { DashboardProfile } from "./Profile";
const Header = styled(styles.Header)`
	display: flex;
	justify-content: center;
`;

const HeaderContent = styled.div`
	width: 77.5%;
	display: flex;
`;

const Logo = styled(styles.logo)`
	margin-right: 30px;
`;
const VerticalRule = styled(Vr)`
	margin: 0.5rem 0;
`;

const DashboardHeader = ({user}) => {
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
						<Anchor
							newTab
							href="https://www.patreon.com/disstreamchat?fan_landing=true"
						>
							Support Us
						</Anchor>
					</styles.navItem>
					<DashboardProfile user={user}/>
				</styles.nav>
			</HeaderContent>
		</Header>
	);
};

export default DashboardHeader;
