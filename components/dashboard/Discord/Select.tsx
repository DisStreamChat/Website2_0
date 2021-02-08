import { JSXElementConstructor, useState } from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import { ClickAwayListener } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";

const SelectBody = styled.div`
	width: 100%;
	background: rgb(43, 47, 51);
	border-radius: 3px;
	border: 1px solid rgb(0, 0, 0);
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	box-sizing: border-box;
	padding: 6px;
	min-height: 50px;
	ul {
		margin: 0px;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		& > * + * {
			margin-left: 0.5rem !important;
		}
	}
`;

interface selectItem {
	value: string;
	label: string | JSX.Element | HTMLElement;
	dropDownLabel?: string | JSX.Element | HTMLElement;
}

interface selectProps {
	closeMenuOnSelect?: boolean;
	onChange: (value: any) => void;
	disabled?: boolean;
	value: selectItem[];
	options: selectItem[];
}

const SelectButton = styled.button`
	border: 1px solid white;
`;

const AddButton = styled.button`
	background: none;
	outline: none;
	color: white;
	border: 1px solid #666;
	display: flex;
	border-radius: 50%;
	width: 28px;
	height: 28px;
	justify-content: center;
`;

const AddItem = styled.li`
	position: relative;
`;

const SelectArea = styled(motion.div)`
	position: absolute;
	display: flex;
    flex-direction: column;
    width: 250px;
    background: rgb(39, 43, 46);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 50%) 0px 2px 10px 0px, rgb(32 34 37 / 60%) 0px 0px 0px 1px;
	height: 100px;
	right: 0;
	
`;

const inState = {
	y: 12,
	opacity: 1,
	x: "50%"
};

const outState = {
	y: -20,
	opacity: 0,
	x: "50%",
};

const Select = (props: selectProps) => {
	const [open, setOpen] = useState(false);

	return (
		<SelectBody>
			<ul className="">
				{props.value.map(item => (
					<li>{item.label}</li>
				))}
				<AddItem>
					<AddButton onClick={() => setOpen(prev => !prev)}>
						<AddIcon />
					</AddButton>
					<ClickAwayListener onClickAway={() => setOpen(false)}>
						<AnimatePresence>
							{open && (
								<SelectArea
									initial={outState}
									exit={outState}
									animate={inState}
								></SelectArea>
							)}
						</AnimatePresence>
					</ClickAwayListener>
				</AddItem>
			</ul>
		</SelectBody>
	);
};

export default Select;
