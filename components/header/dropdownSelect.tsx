import { useState } from "react";
import styles from "./index.styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import styled from "styled-components";

interface dropdownProps {
	title: string;
}

const DropDownMain = styled(styles.NavItem).attrs({ as: "button" })`
	display: flex;
	align-items: center;
	flex-direction: row;
`;

const DropdownSelect = (props: dropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropDownMain>
			{props.title} <KeyboardArrowDownIcon />
		</DropDownMain>
	);
};

export default DropdownSelect;
