import { AnimateSharedLayout, motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";
import { Main } from "../../components/shared/styles";

const DashboardContainer = styled(Main)`
	display: flex;
	justify-content: center;
	min-height: calc(100vh - 80px);
	padding-top: 2rem;
	@media screen and (max-width: 1024px) {
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
	}
`;

const SideBar = styled.div`
	display: flex;
	flex-direction: column;
	width: 25%;
	max-width: 300px;
	@media screen and (max-width: 1024px) {
		flex-direction: row;
		justify-content: space-around;
		width: 80%;
		max-width: 80%;
	}
`;

const SideBarItem = styled(motion.div)`
	a {
		align-items: center;
		display: flex;
		height: 50px;
		padding: 0 1rem;
		border-radius: 0.25rem;
		text-transform: capitalize;
		z-index: 10;
		position: relative;
	}
	position: relative;
	/* overflow: hidden; */
	@media screen and (max-width: 1024px) {
		text-align: center;
	}
`;

const ContentArea = styled.div`
	margin: 0 0 0 2rem;
	min-width: 60%;
	outline: solid;
	@media screen and (max-width: 1024px) {
		margin: 2rem 0 0 0;

		min-width: 80%;
	}
	@media screen and (max-width: 320px){
		min-width: 90%;
	}
`;

const Background = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: var(--disstreamchat-blue);
	border-radius: 0.25rem;
`;

const Dashboard = ({ type }) => {
	return (
		<DashboardContainer>
			<SideBar>
				<AnimateSharedLayout>
					<SideBarItem>
						<Link href="app">
							<a>App Settings</a>
						</Link>
						{type?.[0] === "app" && (
							<Background
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
								}}
								layoutId="background"
							/>
						)}
					</SideBarItem>
					<SideBarItem>
						<Link href="discord">
							<a>Discord Settings</a>
						</Link>
						{type?.[0] === "discord" && (
							<Background
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
								}}
								layoutId="background"
							/>
						)}
					</SideBarItem>
					<SideBarItem>
						<Link href="account">
							<a>Account Settings</a>
						</Link>
						{type?.[0] === "account" && (
							<Background
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
								}}
								layoutId="background"
							/>
						)}
					</SideBarItem>
				</AnimateSharedLayout>
			</SideBar>
			<ContentArea></ContentArea>
		</DashboardContainer>
	);
};

export const getServerSideProps = async context => {
	const { res, params } = context;
	if (!params.type) {
		try {
			res.writeHead(302, { location: "/dashboard/app" });
			res.end();
		} catch (err) {}
		return { props: {} };
	}
	if (!["app", "discord", "account"].includes(params.type[0])) {
		return { notFound: true };
	}
	return { props: { type: params.type } };
};

export default Dashboard;
