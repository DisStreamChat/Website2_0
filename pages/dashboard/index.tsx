const Dashboard = () => {
	return <></>;
};

export const getServerSideProps = async context => {
	const { res } = context;
	res.writeHead(301, { location: "/dashboard/app" });
	res.end();
	return { props: {} };
};

export default Dashboard;
