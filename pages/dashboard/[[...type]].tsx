const Dashboard = () => {
	return <></>;
};

export const getServerSideProps = async context => {
	const { res, params } = context;
	if (!params.type) {
		res.writeHead(302, { location: "/dashboard/app" });
		res.end();
		return { props: {} };
	}
	if (!["app", "discord", "account"].includes(params.type[0])) {
		return { notFound: true };
	}
	return { props: { type: params.type } };
};

export default Dashboard;
