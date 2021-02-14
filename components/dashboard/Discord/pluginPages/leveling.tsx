import { Switch } from "@material-ui/core";
import React, { useState } from "react";
import { H2 } from "../../../shared/styles/headings";
import { PluginSection, PluginSubHeader, SubSectionTitle } from "./styles";
import Select from "../../../shared/styles/styled-select";
import styled from "styled-components";
import { TextArea } from "../../../shared/ui-components/TextField";

const levelingVariants = {
	initial: {
		height: "0px",
		opacity: 0,
	},
	open: {
		height: "180px",
		opacity: 1,
	},
	closed: {
		opacity: 0,
		height: "-5px",
	},
};

const AnnouncementSection = styled(PluginSection)`
	display: flex;
	& > div {
		flex: 1 1 45%;
	}
`;

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
			<AnnouncementSection
				data-open={levelupAnnouncement}
				// @ts-ignore
				variants={levelingVariants}
				initial="initial"
				animate={levelupAnnouncement ? "open" : "closed"}
			>
				<div>
					<SubSectionTitle>Announcement Channel</SubSectionTitle>
					<Select />
				</div>
				<div>
					<SubSectionTitle>Announcement Message</SubSectionTitle>
					<TextArea />
				</div>
			</AnnouncementSection>
			<hr />
			<PluginSubHeader>
				<span>
					<H2>Xp rate</H2>
					<h4>
						Change the leveling difficulty by tweaking the rate at which your members
						will gain XP.
					</h4>
				</span>
			</PluginSubHeader>
		</div>
	);
};

export default Leveling;
