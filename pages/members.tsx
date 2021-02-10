import Head from "next/head";
import { Hero, Main } from "../components/shared/styles";

const Team = () => {
	return (
		<>
			<Head>
				<title>DisStreamChat | Team</title>
			</Head>
			<Main>
				<Hero></Hero>
			</Main>
		</>
	);
};

export default Team;
