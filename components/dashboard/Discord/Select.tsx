import { JSXElementConstructor } from "react";
import styled from "styled-components";

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

const Select = (props: selectProps) => {
	return (
		<SelectBody>
			<ul className="">
				{props.value.map(item => (
					<li>{item.label}</li>
				))}
			</ul>
		</SelectBody>
	);
};

export default Select;
