import { AnimatePresence } from "framer-motion";
import React from "react";
import { SaveSection } from "../../dashboard/Discord/styles";
import { RedButton, GreenButton } from "./Button";
import { useBeforeunload } from 'react-beforeunload';

export interface saveBarProps {
	changed?: boolean,
	reset: () => void,
	save: () => void
}

const SaveBar = ({changed, reset, save}: saveBarProps) => {

	useBeforeunload((e) => {
		if(changed){
			e.preventDefault()
		}else{
			return false
		}
	});

	return (
		<AnimatePresence>
			{changed && (
				<SaveSection
					initial={{ y: 20, x: "-50%", opacity: 0 }}
					exit={{ y: 20, x: "-50%", opacity: 0 }}
					animate={{ y: 0, x: "-50%", opacity: 1 }}
					transition={{ type: "spring" }}
				>
					<div>You have unsaved Changes</div>
					<div>
						<RedButton onClick={reset}>Reset</RedButton>
						<GreenButton onClick={save}>Save</GreenButton>
					</div>
				</SaveSection>
			)}
		</AnimatePresence>
	);
};

export default SaveBar;
