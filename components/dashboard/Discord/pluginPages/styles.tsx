import styled from "styled-components";
import { motion } from "framer-motion";
import { gap } from "../../../shared/styles";

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

export const PluginSection = styled(gap).attrs({ as: motion.div })`
	transform-origin: top left;
	border-radius: 0.25rem;
	&[data-open="false"] {
		overflow: hidden;
	}
	display: flex;
	/* height: 100px; */
`;

export const SubSectionTitle = styled.span`
	font-weight: 700;
	text-transform: uppercase;
`;
