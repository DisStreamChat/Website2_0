import { AnimateSharedLayout } from "framer-motion";
import Link from "next/link";
import nookies from "nookies";
import { verifyIdToken } from "../../firebase/admin";
import {
	DashboardContainer,
	SideBar,
	SideBarItem,
	Background,
	ContentArea,
} from "../../components/dashboard/styles";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import dynamic from "next/dynamic";
const Discord = dynamic(() => import("../../components/dashboard/Discord/Discord"));
const App = dynamic(() => import("../../components/dashboard/App"));
const Account = dynamic(() => import("../../components/dashboard/Account"));

const Dashboard = ({ type, session }) => {
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
							<a>Discord Dashboard</a>
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
			<ContentArea>
				{type[0] === "discord" && <Discord />}
				{type[0] === "app" && <App />}
				{type[0] === "account" && <Account />}
			</ContentArea>
		</DashboardContainer>
	);
};

export const getServerSideProps: GetServerSideProps  = async context => {
	const { res, params } = context;
	const { referer } = context.req.headers;
	let session = null;
	const cookies = nookies.get(context);
	try {
		const token = await verifyIdToken(cookies.token);
		if (!token) throw new Error("no token");
		if (typeof token === "boolean") session = token;
		else {
			const { uid } = token;
			session = { uid };
		}
	} catch (err) {
		res.writeHead(307, { location: "/" }).end();
		return { props: {} };
	}

	if (!params.type) {
		res.writeHead(307, { location: "/dashboard/app" }).end();
		return { props: {} };
	}
	if (!["app", "discord", "account"].includes(params.type[0])) {
		return { notFound: true };
	}
	return { props: { type: params.type, session } };
};

export default Dashboard;
