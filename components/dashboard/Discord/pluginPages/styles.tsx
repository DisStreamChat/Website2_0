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
	display: flex;
	align-items: center;
	& > * + * {
		margin-left: 1rem;
	}
	h4 {
		font-weight: 400;
		color: #aaa;
	}
`;

export const PluginSection = styled(motion.div)`
	transform-origin: top left;
	margin: 0.25rem 0;
	padding: 0.5rem;
	border-radius: 0.25rem;
	overflow: hidden;
	display: flex;
	
	/* height: 100px; */
`;
