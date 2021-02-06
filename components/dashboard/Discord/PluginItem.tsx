import styled from "styled-components";
import Switch from "@material-ui/core/Switch";
import { useState } from "react";

interface pluginProps {
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
	line-height: 1.5rem;
`;

const PluginSwitch = styled.div`
	position: absolute;
	/* top: 25px; */
	right: 0;
`;

const PluginItem = (props: pluginProps) => {
	const [checked, setChecked] = useState(props.active);

	return (
		<PluginCard href={checked ? `${props.serverId}/${props.id}` : null}>
			<div>
				<img src={`/${props.image}`} alt="" width={50} height={50} />
			</div>
			<div>
				<PluginTitle>{props.title}</PluginTitle>
				<PluginBody>{props.description}</PluginBody>
			</div>
			<PluginSwitch>
				<Switch
					checked={checked}
					onChange={e => setChecked(e.target.checked)}
					color="primary"
					name="checkedB"
					inputProps={{ "aria-label": "primary checkbox" }}
				/>
			</PluginSwitch>
		</PluginCard>
	);
};

export default PluginItem;
