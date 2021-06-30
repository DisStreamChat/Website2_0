import Select from "react-select";
import { colorStyles } from "../../../utils/constants";

const StyledSelect = (props) => {
	return (
		<Select
			{...props}
			styles={colorStyles(props.width || "80%")}
		/>
	);
};

export default StyledSelect;
