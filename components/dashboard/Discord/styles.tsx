import styled from "styled-components";
import { H2 } from "../../shared/styles/headings";

export const ServerSelectBody = styled.div`
	/* margin: 0.5rem 0; */
	margin-bottom: 0.5rem;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

export const ServerTitle = styled(H2)`
	margin-top: 0;
	margin-bottom: 0.5rem;
	text-transform: uppercase;
`;

export const Title = styled(H2)`
	margin: 0.5rem 0;
`;

export const ServerItemBody = styled.div`
	width: calc(50% - 1rem);
	background: #17181b;
	padding: 1rem;
	border-radius: 0.25rem;
	display: flex;
	& > * + * {
		margin-left: 0.5rem;
	}
`;
