import Error from "../components/shared/error";

const CustomError = () => {
	return (
		<Error
			message="The page you are looking for might have been removed or is temporarily
	unavailable"
			title="404 Not Found"
		/>
	);
};

export default CustomError;
