import styled from "styled-components";

interface iconProps {
	icon: string;
	id: string;
	size?: string | number;
	name?: string;
}

const NoIcon = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${({size}: {size: number}) => `${size/2}px`};
	text-transform: uppercase;
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
