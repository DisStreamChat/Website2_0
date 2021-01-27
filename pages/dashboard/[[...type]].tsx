import { AnimateSharedLayout} from "framer-motion";
import Link from "next/link";
import nookies from "nookies";
import { verifyIdToken } from "../../firebase/admin";
import {
	DashboardContainer,
	SideBar,
	SideBarItem,
	Background,
	ContentArea
} from "../../components/dashboard/styles"

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
	const { referer } = context.req.headers;
	let session;
	try {
		const cookies = nookies.get(context);
		const token = await verifyIdToken(cookies.token);
		if (!token) throw new Error("no token");
		if (typeof token === "boolean") session = token;
		else {
			const { uid, email } = token;
			session = { uid, email };
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
