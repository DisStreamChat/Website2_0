import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, forwardRef, LegacyRef } from "react";

interface AnchorProps
	extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	newTab?: boolean;
	as?: string;
	local?: boolean;
}

const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
	({ newTab, ...props }: AnchorProps, ref) => {
		const Rel = newTab ? "noopener noreferrer" : props.rel;
		const Target = newTab ? "_blank" : null;
		const A = <a ref={ref} {...props} rel={Rel} target={Target}></a>;
		return props.local ? (
			<Link as={props.as} href={props.href} passHref>
				<a ref={ref} {...props} rel={Rel} target={Target}></a>
			</Link>
		) : (
			A
		);
	}
);

export default Anchor;
