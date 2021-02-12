import styled from "styled-components";
import Switch from "@material-ui/core/Switch";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface pluginProps {
	id: string;
	title: string;
	image: string;
	description: string;
	comingSoon?: boolean;
	active: boolean;
	setActive?: (value: boolean) => void;
	serverId?: string
}

const PluginCard = styled.a`
	display: block;
	background: #ffffff10;
	border-radius: 0.25rem;
	transition: 0.25s;
	cursor: pointer;
	position: relative;
	display: grid;
	grid-template-columns: 50px 1fr 10px;
	min-width: 350px;
	min-height: 120px;
	padding: 20px;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	/* align-items: center; */
	box-shadow: 3px 3px 5px 0 #111;
	& > * + * {
		margin-left: 0.75rem;
	}
	@supports (gap: 10px) {
		gap: 0.75rem;
		& > * + * {
			margin-left: 0;
		}
	}
	& span:last-child,
	div:first-child {
		align-self: start;
	}
`;

const PluginTitle = styled.div`
	font-size: 1.25rem;
	font-weight: bold;
	text-transform: uppercase;
`;

const PluginBody = styled.div`
	font-weight: 400;
	color: #aaa;
	margin-top: 0.25rem;
	line-height: 1.5;
	font-size: .85rem;
`;

const PluginSwitch = styled.div`
	position: absolute;
	top: 5px;
	right: 0;
`;

const PluginLine = styled(motion.div)`
	height: 5px;
	background: black;
	width: 100%;
	position: absolute;
	&.bottom{
		bottom: 0;
	}
`

const PluginItem = (props: pluginProps) => {


	return (
		<PluginCard href={props.active ? `${props.serverId}/${props.id}` : null}>
			<PluginLine/>
			<div>
				<img alt={props.title} src={`/${props.image}`}  width={50} height={50} />
			</div>
			<div>
				<PluginTitle>{props.title}</PluginTitle>
				<PluginBody>{props.description}</PluginBody>
			</div>
			<PluginSwitch>
				<Switch
					checked={props.active}
					onChange={e => props.setActive(e.target.checked)}
					color="primary"
					name="checkedB"
					disabled={props.comingSoon}
					inputProps={{ "aria-label": `${props.title} activity switch` }}
				/>
			</PluginSwitch>
			<PluginLine className="bottom"/>
		</PluginCard>
	);
};

export default PluginItem;
