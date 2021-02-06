import React, { useState } from "react";
import styles from "./index.styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Anchor from "../shared/ui-components/Anchor";

interface item {
	name: string;
	link: string;
	local?: boolean;
}

interface dropdownProps {
	title: string;
	items: item[];
}

const DropDownMain = styled(styles.NavItem).attrs({ as: "button" })`
	display: flex;
	align-items: center;
	flex-direction: row;
	position: relative;
`;

const DropDownMenu = styled(motion.div)`
	position: absolute;
	overflow: hidden;
`;

const DropdownSelect = (props: dropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropDownMain
			onClick={() => {
				setIsOpen(prev => !prev);
			}}
		>
			{props.title}{" "}
			<styles.Chevron animate={isOpen ? { rotate: 180 } : { rotate: 0 }}>
				<KeyboardArrowDownIcon />
			</styles.Chevron>
			<AnimatePresence>
				{isOpen && (
					<DropDownMenu
						initial={{ y: 0, opacity: 0 }}
						animate={{
							y: 25,
							opacity: 1,
						}}
						exit={{ y: 0, opacity: 0 }}
					>
						{props.items.map(item =>
							item.local ? (
								<Link href={item.link}>
									<a>{item.name}</a>
								</Link>
							) : (
								<Anchor href={item.link}>{item.name}</Anchor>
							)
						)}
					</DropDownMenu>
				)}
			</AnimatePresence>
		</DropDownMain>
	);
};

export default DropdownSelect;