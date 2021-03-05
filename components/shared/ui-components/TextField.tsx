import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";

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

const StyledTextArea = styled.textarea`
	width: 100%;
	font-size: 14px;
	font-family: "Open Sans", sans-serif, Helvetica, arial, sans-serif;
	color: rgb(255, 255, 255);
	border: 1px solid rgb(26, 26, 26);
	background: #3e4349;
	border-radius: 3px;
	padding: 15px 15px 35px;
	font-weight: 500;
	outline: none;
	box-sizing: border-box;
	min-height: 150px;
	transition: border 250ms ease-out 0s;
	resize: none;
`;

export interface TextProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	prefix?: string
}

export const TextInput = forwardRef(
	({prefix, value, ...props}: TextProps, ref) => {
		const hasValue = value != undefined
		return (
			<TextInputBody className={props.className}>
				<InnerTextInput value={hasValue ? `${prefix||""}${value}` : undefined} {...props} ref={ref as any} type="text" />
			</TextInputBody>
		);
	}
);

const TextAreaParent = styled.div`
	position: relative;
`;

interface textareaProps
	extends DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	emojiPicker?: boolean;
	maxCharacters?: number;
	trigger: {
		[key: string]: any
	}
}

export const TextArea = forwardRef(
	({ emojiPicker, maxCharacters, ...props }: textareaProps, ref) => {
		return (
			<TextAreaParent>
				<ReactTextareaAutocomplete
					{...props}
					movePopupAsYouType
					className="my-textarea"
					loadingComponent={() => <span>Loading</span>}
					trigger={props.trigger}
					textAreaComponent={StyledTextArea}
					listClassName="text-area-list"
					itemClassName="text-area-item"
				/>
				{/* <StyledTextArea {...props} ref={ref as any}></StyledTextArea> */}
				{/* emojiPicker && <EmojiPicker/> */}
				{/* maxCharacters ?? <CharCounter max={maxCharacters} text={value}/> */}
			</TextAreaParent>
		);
	}
);
