import styled from "styled-components";
import { H2 } from "../../shared/styles/headings";

export const ServerSelectBody = styled.div`
	/* margin: 0.5rem 0; */
	margin-bottom: 2rem;
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
	flex: 1 1 49%;
	align-items: center;
	background: #17181b;
	padding: 1rem;
	border-radius: 0.25rem;
	display: flex;
	@media screen and (max-width: 425px){
		font-size: .75rem;
	}
	& > * + * {
		margin-left: 0.5rem;
	}
`;
