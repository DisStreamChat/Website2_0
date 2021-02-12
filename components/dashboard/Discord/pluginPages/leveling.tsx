import { Switch } from "@material-ui/core";
import React, { useState } from "react";
import { H2 } from "../../../shared/styles/headings";
import { PluginSection, PluginSubHeader } from "./styles";

const levelingVariants = {
	open: {
		height: "0px",
	},
	closed: {
		height: "100px",
	},
};

const Leveling = () => {
	const [levelupAnnouncement, setLevelupAnnouncement] = useState(false);

	return (
		<div>
			<PluginSubHeader>
				<span>
					<H2>Level up announcement</H2>
					<h4>
						Whenever a user gains a level, DisStreamBot can send a personalized message.
					</h4>
				</span>
				<Switch
					color="primary"
					value={levelupAnnouncement}
					onChange={e => setLevelupAnnouncement(e.target.checked)}
				/>
			</PluginSubHeader>
			<PluginSection
				data-open={levelupAnnouncement}
				variants={levelingVariants}
				initial="closed"
				animate={levelupAnnouncement ? "open" : "closed"}
			>
				<div></div>
				<div></div>
			</PluginSection>
		</div>
	);
};

export default Leveling;
