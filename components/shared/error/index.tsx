import Link from "next/link";
import React from "react";
import { NotFoundContainer, NotFoundHeader, NotFoundText } from "./index.styled";

interface ErrorProps {
	title: string,
	message: string,
}

function CustomError(props: ErrorProps) {
	return (
		<NotFoundContainer>
			<NotFoundHeader>
				<h1>{props.title}</h1>
			</NotFoundHeader>
			<img width="350" height="275" src="/dead_logo.png" alt="" />
			<NotFoundText>
				<h1>I have bad news for you</h1>
				<p>
					{props.message}
				</p>
				<Link href="/">
					<a>Back to homepage</a>
				</Link>
			</NotFoundText>
		</NotFoundContainer>
	);
}

export default CustomError;