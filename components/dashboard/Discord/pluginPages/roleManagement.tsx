import { ReactNode, ReactNodeArray, useContext } from "react";
import { discordContext } from "../discordContext";
import styled from "styled-components";
import { H1 } from "../../../shared/styles/headings";
import { Switch } from "@material-ui/core";

interface sectionProps {
	id: string;
	title: string;
	open?: boolean;
	setOpen?: () => void
}

const StyledRoleSection = styled.section`
	h5 {
		color: rgb(255, 255, 255);
		font-weight: 600;
		font-size: 16px;
	}
	border-top: 1px solid #aaaaaa44;
	&:first-child{
		margin-top: 1rem;
	}
`;

const RoleSectionTitle = styled.div`
	padding: 1.5rem 0;
	display: flex;
	justify-content: space-between;
`

const RoleSection: React.FC<sectionProps> = props => {
	return (
		<StyledRoleSection>
			<RoleSectionTitle>
				<h5>{props.title}</h5>
				<Switch color="primary"></Switch>
			</RoleSectionTitle>
			<div></div>
		</StyledRoleSection>
	);
};



const RoleManagement = () => {
	const { roles, allChannels, emotes } = useContext(discordContext);

	return (
		<>
			<RoleSection
				title="Let your members get roles by reacting to a message"
				id="reaction"
			></RoleSection>
			<RoleSection
				title="Let your members get roles with commands"
				id="command"
			></RoleSection>
			<RoleSection title="Give members a role on join" id="join"></RoleSection>
			<RoleSection title="Give descriptions to the roles in your server" id=""></RoleSection>
		</>
	);
};

export default RoleManagement;
