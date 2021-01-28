import { H1, H2 } from "../../shared/styles/headings";
import styled from "styled-components";
import dynamic from "next/dynamic"
const ServerSelect = dynamic(() => import("./ServerSelect"))

const Description = styled.p`
	font-weight: 400;
	font-size: 1.17rem;
	margin: 0.5rem 0;
	opacity: 0.8;
`;


const ServerArea = styled.div``;

const Discord = () => {
	return (
		<>
			<H1>Discord Dashboard</H1>
			<Description>
				Connect your discord account to DisStreamChat to get discord messages in your
				client/overlay during stream and manage DisStreamBot in your server.
			</Description>
			<hr />
			<ServerSelect/>
		</>
	);
};

export default Discord;
