import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";

const TextInputBody = styled.div`
	display: flex;
	padding: 0px 15px;
	width: 100%;
	color: rgb(255, 255, 255);
	background: rgb(43, 47, 51);
	border: 1px solid rgb(26, 26, 26);
	border-radius: 3px;
	font-size: 15px;
	font-weight: 400;
	outline: none;
	box-sizing: border-box;
	transition: border 250ms ease-out 0s;
`;

const InnerTextInput = styled.input`
	border: none;
	outline: none;
	background-color: transparent;
	color: inherit;
	font-family: inherit;
	font-size: inherit;
	padding: 15px 0px;
	width: 100%;
`;

export const TextInput = forwardRef((props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, ref) => {
	return (
		<TextInputBody className={props.className}>
			<InnerTextInput {...props} ref={ref as any} type="text" />
		</TextInputBody>
	);
});

export const TextArea = () => {};
