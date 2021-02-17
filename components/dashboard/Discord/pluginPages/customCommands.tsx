import React from "react";
import styled from "styled-components";
import { H2 } from "../../../shared/styles/headings";
import { BlueButton } from "../../../shared/ui-components/Button";
import { PluginSubHeader } from "./styles";

const CommandsHeader = styled(PluginSubHeader)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	align-items: flex-start;
	& > * + * {
		margin-top: 1rem;
		margin-left: 0;
	}
`

const CustomCommands = () => {


	return (
		<div>
			<CommandsHeader>
				<span>
					<H2>Text Command</H2>
					<h4>A simple command that responds with a custom message in DM or public</h4>
				</span>
				<span>
					<BlueButton>Create Command</BlueButton>
				</span>
			</CommandsHeader>
			<CommandsHeader>
				<span>
					<H2>Commands - </H2>
				</span>
			</CommandsHeader>
		</div>
	);
};

export default CustomCommands;
