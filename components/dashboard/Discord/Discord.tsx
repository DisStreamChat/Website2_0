import { H1, H2 } from "../../shared/styles/headings";
import styled from "styled-components";
import { SmallTitle } from "../styles";
import StyledSelect from "../../shared/styles/styled-select";

const Description = styled.p`
	font-weight: 400;
	font-size: 1.17rem;
	margin: 0.5rem 0;
`;

const ServerSelect = styled.div`
	/* margin: 0.5rem 0; */
	margin-bottom: .5rem;
`;

const ServerTitle = styled(H2)`
	margin-top: 0;
	margin-bottom: 0.5rem;
`;

const Discord = () => {
	return (
		<>
			<H1>Discord Dashboard</H1>
			<Description>
				Connect your discord account to DisStreamChat to get discord messages in your
				client/overlay during stream and manage DisStreamBot in your server.
			</Description>
			<hr />
			<ServerSelect>
				<ServerTitle>Server</ServerTitle>
				<StyledSelect placeholder="Select a Server" />
			</ServerSelect>
			<hr/>
		</>
	);
};

export default Discord;
