import {
	JSXElementConstructor,
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	padding: 0.75rem;
	min-height: 50px;
	ul {
		margin: 0px;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		& > * + * {
			margin-left: 0.5rem !important;
		}
		@supports (gap: 10px) {
			& > * + * {
				margin-left: 0 !important;
			}
			gap: 0.5rem;
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
	:focus,
	:hover {
		background: #66666666;
	}
`;

const AddItem = styled.li`
	position: relative;
`;

const SelectArea = styled(motion.div)`
	z-index: 10000;
	position: absolute;
	display: flex;
	flex-direction: column;
	min-width: 250px;
	background: rgb(39, 43, 46);
	border-radius: 4px;
	box-shadow: rgb(0 0 0 / 50%) 0px 2px 10px 0px, rgb(32 34 37 / 60%) 0px 0px 0px 1px;
	right: 0;
	max-height: 264px;
	overflow: auto;
	/* padding: 1rem 0; */
	cursor: pointer;
	ul {
		display: flex;
		flex-direction: column;
		gap: 0 !important;
		li {
			padding: 1rem;
			&:hover {
				background: #00000020;
			}
		}
	}
`;

const inState = {
	y: 12,
	opacity: 1,
	x: "50%",
};

const outState = {
	y: -20,
	opacity: 0,
	x: "50%",
};

const SearchArea = styled.div`
	background: var(--background-dark-gray);
	position: sticky;
	top: 0;
	input {
		padding: 1rem;
		color: white;
		background: none;
		outline: none;
		border: none;
		font-family: "Open sans";
	}
`;

const calculateSizeAndPosition = (
	optionsLength: number,
	buttonRef: MutableRefObject<HTMLButtonElement>
) => {
	const height = Math.min(264, 57*optionsLength);
	const width = 250;
	if (!buttonRef?.current) return {};
	const rect = buttonRef.current.getBoundingClientRect();
	const buttonBottom = rect.bottom;
	const buttonCenterX = rect.left + Math.abs(rect.left - rect.right) / 2;

	const boxTop = buttonBottom + 25;
	return { height, width, top: boxTop, center: buttonCenterX };
};

const Select = (props: selectProps) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const buttonRef = useRef<HTMLButtonElement>();

	const options = useMemo(
		() =>
			props.options.filter(
				option => !props.value?.find(value => value.value === option.value)
			),
		[props.options, props.value]
	);

	const { width, height, top, center } = calculateSizeAndPosition(
		props.options?.length || 0,
		buttonRef
	);

	const overflowLeft = center < width / 2;
	const overflowRight = center > width / 2 + window?.innerWidth;

	const overflowBottom = top > window?.innerHeight - height;

	if (overflowLeft) {
		inState.x = `${width / 1.25}px`;
		outState.x = `${width / 1.25}px`;
	} else {
		inState.x = "50%";
		outState.x = "50%";
	}

	if (overflowBottom) {
		inState.y = (height + 50) * -1;
		outState.y = (height + 38) * -1;
	} else {
		inState.y = 12;
		outState.y = 20;
	}

	useEffect(() => {
		if (!options?.length) {
			setOpen(false);
		}
	}, [options]);

	return (
		<SelectBody>
			<ul className="">
				{props?.value?.map?.(item => (
					<li key={item.value}>{item.label}</li>
				))}
				{!!options?.length && (
					<AddItem>
						<AddButton
							ref={buttonRef as any}
							onMouseDown={e => e.preventDefault()}
							onFocus={() => buttonRef.current.scrollIntoView()}
							onClick={() => setOpen(prev => !prev)}
						>
							<AddIcon />
						</AddButton>
						<AnimatePresence>
							{open && (
								<ClickAwayListener onClickAway={() => setOpen(false)}>
									<SelectArea
										initial={outState}
										exit={outState}
										animate={inState}
									>
										<SearchArea>
											<input
												placeholder="Search"
												type="text"
												value={searchValue}
												onChange={e => setSearchValue(e.target.value)}
											/>
										</SearchArea>
										<ul className="">
											{options
												.filter(option =>
													option.value
														?.toLowerCase()
														?.includes?.(searchValue?.toLowerCase())
												)
												.map(option => (
													<li
														key={option.value}
														onClick={() => {
															props.onChange(option);
															if (props.closeMenuOnSelect) {
																setOpen(false);
															}
														}}
													>
														{option.label}
													</li>
												))}
										</ul>
									</SelectArea>
								</ClickAwayListener>
							)}
						</AnimatePresence>
					</AddItem>
				)}
			</ul>
		</SelectBody>
	);
};

export default Select;
