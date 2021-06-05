import { MutableRefObject, useEffect, useRef, useState } from "react";

export const useInteraction = (ref: MutableRefObject<HTMLElement>) => {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);

	if(!ref.current) return []

	ref.current.addEventListener("focusin", () => {
		setFocused(true);
	});

	ref.current.addEventListener("focusout", () => {
		setFocused(false);
	});

	ref.current.addEventListener("mouseenter", () => {
		setHovered(true);
	});

	ref.current.addEventListener("mouseleave", () => {
		setHovered(false);
	});

	return [hovered, focused, hovered || focused, hovered && focused];
};

