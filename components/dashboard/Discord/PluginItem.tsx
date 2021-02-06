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
}

const PluginCard = styled.div`
	background: #ffffff10;
	border-radius: 0.25rem;
	transition: 0.25s;
	cursor: pointer;
	position: relative;
	display: flex;
	min-width: 350px;
	min-height: 120px;
	padding: 20px;
	align-items: center;
	box-shadow: 3px 3px 5px 0 #111;
`;

const PluginItem = (props: pluginProps) => {

	const [checked, setChecked] = useState(props.active)

	return (
		<PluginCard>
			<Switch
				checked={checked}
				onChange={e => setChecked(e.target.checked)}
				color="primary"
				name="checkedB"
				inputProps={{ "aria-label": "primary checkbox" }}
			/>
		</PluginCard>
	);
};

export default PluginItem;
