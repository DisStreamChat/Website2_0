import { Switch } from "@material-ui/core";
import React from "react";
import { H2 } from "../../../shared/styles/headings";
import { PluginSection, PluginSubHeader } from "./styles";

const Leveling = () => {
	return (
		<div>
			<PluginSubHeader>
				<span>
					<H2>Level up announcement</H2>
					<h4>
						Whenever a user gains a level, DisStreamBot can send a personalized message.
					</h4>
				</span>
				<Switch/>
			</PluginSubHeader>
			<PluginSection/>
		</div>
	);
};

export default Leveling;
