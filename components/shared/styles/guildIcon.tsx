import styled from "styled-components";

interface iconProps {
	icon: string;
	id: string;
	size?: string | number;
	name?: string;
}

interface noIconProps {
	size: number,
	name: string
}

export const NoIcon = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${({ size, name }: { size: number; name: string }) => `${size / name.length}px`};
	text-transform: uppercase;
	border-radius: 50%;
	background: #36393f;
	width: ${({size}: noIconProps) => `${size}px`};
	height: ${({size}: noIconProps) => `${size}px`};
	box-sizing: content-box;
	padding: .5rem;
	text-align: center;
`;

const GuildIcon = (props: iconProps) => {
	return props.icon ? (
		<img
			style={{
				minWidth: props.size,
				height: props.size,
				borderRadius: "50%",
				marginRight: "1rem",
			}}
			alt=""
			src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}`}
		></img>
	) : (
		<NoIcon
			name={props.name.split(" ").map(w => w[0]).join("")}
			size={Number(props.size)}
			style={{
				maxWidth: props.size,
				minWidth: props.size,
				height: props.size,
				borderRadius: "50%",
				marginRight: "1rem",
				backgroundColor: "#36393f",
			}}
		>
			{props?.name?.split?.(" ")?.map(w => w[0])}
		</NoIcon>
	);
};

export default GuildIcon;
