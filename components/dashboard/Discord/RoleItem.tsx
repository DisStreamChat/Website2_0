import styled from "styled-components";

const colorify = number =>
	`#${number === 0 ? "99aab5" : number?.toString?.(16)?.padStart?.(6, "0") || "black"}`;


interface styledRoleProps {
	disabled?: boolean,
	color: string
}

const StyledRoleItem = styled.div`
	border-radius: 22px;
	padding: 0.25rem 0.5rem;
	font-size: 12px;
	width: max-content;
	display: flex;
	align-items: center;
	background: #2f3136cc;
	border: 2px solid ${props => colorify(props.color)};
	line-height: 1;
	position: relative;
	font-weight: 600;
	color: #ccc;
	filter: brightness(${(props: styledRoleProps) => props.disabled ? "75%" : "100%" });
	&:hover {
		.button {
			${(props: styledRoleProps) => !props.disabled ? "color: white;" : ""}
		}
	}
	.button {
		border: none;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		margin: 0;
		text-align: center;
		width: 12px;
		height: 12px;
		margin-left: -0.25rem;
		margin-right: 0.25rem;
		border-radius: 50%;
		background: ${props => colorify(props.color)};
		color: ${props => colorify(props.color)};
		cursor: pointer;
		user-select: none;
	}
`;

interface roleProps {
	color: string;
	name: string;
	id: string;
	onClick?: (e: any) => void;
	disabled?: boolean
}

const RoleItem = (props: roleProps) => {
	return (
		<StyledRoleItem disabled={!!props.disabled} color={props.color}>
			<div onClick={() => props?.onClick?.(props.id)} className="button">x</div>
			{props.name}
		</StyledRoleItem>
	);
};

export const RoleOption = styled.div`
	color: ${props => colorify(props.color)};
`;

export default RoleItem;
