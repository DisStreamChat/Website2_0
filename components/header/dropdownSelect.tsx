import { useState } from "react";
import styles from "./index.styles";

interface dropdownProps {
	title: string;
}

const DropdownSelect = (props: dropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return <styles.navItem>{props.title}</styles.navItem>;
};

export default DropdownSelect;
