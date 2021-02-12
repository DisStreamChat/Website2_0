import styled from "styled-components";
import { motion } from "framer-motion";

export const Plugins = styled.div`
	h2,
	h4 {
		margin: 0;
	}
	h2 {
		font-size: 1.25rem;
		text-transform: uppercase;
	}
`;

export const PluginSubHeader = styled.div`
	h4 {
		font-weight: 400;
		color: #aaa;
	}
`;

export const PluginSection = styled.div`
	margin: 0.25rem 0;
	/* background: var(--background-dark-gray); */
	padding: 0.5rem;
	border-radius: 0.25rem;
	/* border: 0.5px solid #2e2e30; */
`;
