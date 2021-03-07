import styled from "styled-components";
import LazyLoad from "react-lazy-load";
import React from "react";
import { H1 } from "../styles/headings";

export interface FeatureProps {
	title: string;
	subtitle?: string;
	body: string;
	imageClassNames?: string[];
	images: string[];
	reversed?: boolean;
}

const StyledFeature = styled.section`
	height: fit-content;
	display: flex;
	align-items: center;
	color: #aaa;
	margin: 4rem 0;
	gap: 1rem;
	h1 {
		color: white;
		margin-bottom: .5rem;
	}
	p{
		font-size: 1.25rem;
	}
	&:nth-child(odd) .right,
	&:nth-child(odd) .right * {
		text-align: right;
		img {
			display: inline;
			/* text-align: right; */
		}
	}
	& > * {
		flex: 0.5 1;
		margin: 0 0.5rem;
	}
	img {
		width: 100%;
		max-width: 400px;
		height: auto;
		box-shadow: 5px 5px 25px -5px #111;
		&.drop-shadow {
			box-shadow: none !important;
			-webkit-filter: drop-shadow(5px 5px 10px #111);
			filter: drop-shadow(5px 5px 10px #111);
		}
	}
	@media screen and (max-width: 1250px) {
		flex-direction: column-reverse;
		text-align: center;
		h1 {
			font-size: 1.5rem;
		}
		p {
			font-size: 1rem;
		}
	}
`;

const Feature = (props: FeatureProps) => {
	const innerBody = [
		<>
			<H1>{props.title}</H1>
			{props.subtitle && <h2>{props.subtitle}</h2>}
			<p>{props.body}</p>
		</>,
		<>
			{props.images.map((image, idx) => (
				<LazyLoad debounce={false} offsetVertical={700} offsetTop={700}>
					<img key={image} src={image} alt="" className={props.imageClassNames?.[idx]} />
				</LazyLoad>
			))}
		</>,
	];

	return (
		<StyledFeature>
			<div className={`left ${props.images.length === 2 ? "two-images" : ""}`}>
				{innerBody[props.reversed ? 1 : 0]}
			</div>
			<div className={`right ${props.images.length === 2 ? "two-images" : ""}`}>
				{innerBody[!props.reversed ? 1 : 0]}
			</div>
		</StyledFeature>
	);
};

export default Feature;
