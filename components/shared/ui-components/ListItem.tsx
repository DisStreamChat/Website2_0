import React, { DetailedHTMLProps, forwardRef, HTMLProps, LiHTMLAttributes } from "react";
import styled from "styled-components";
import { gap as Gap } from "../styles";
import { BlueButton, DeleteButton, RedButton } from "./Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const ListBody = styled.li<HTMLProps<HTMLLIElement>>`
	box-sizing: border-box !important;
	width: 100%;
	min-height: 85px;
	border-radius: 0.25rem;
	border: 1px solid #000;
	background: #1f1f1f;
	margin: 1rem 0 !important;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	padding: 0.5rem 1rem !important;
`;

const ListItemSection = styled.div`
	display: flex;
	flex-direction: row;
`;

export interface ListItemProps extends HTMLProps<HTMLLIElement> {
	delete: () => void;
	edit: () => void;
}

const ListItem = ({ delete: deleteMe, edit, children, ...props }: ListItemProps) => {
	return (
		//@ts-ignore
		<ListBody {...props}>
			<Gap gap="1rem">{children}</Gap>
			<Gap gap="1rem">
				<BlueButton onClick={edit}>
					<EditIcon /> Edit
				</BlueButton>
				<DeleteButton onClick={deleteMe}>
					<DeleteIcon /> Delete
				</DeleteButton>
			</Gap>
		</ListBody>
	);
};

export default ListItem;
