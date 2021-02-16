import styles from "./index.styles";
import Profile, { DashboardProfile } from "./Profile"

const Sidebar = ({ children, user=null }) => {
	return (
		<styles.sidebar
			key="sidebar"
			exit={{ x: 900, opacity: 0 }}
			initial={{ x: 900, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.25 }}
		>
			{children}
			{user ? <DashboardProfile user={user}/> : <Profile />}
		</styles.sidebar>
	);
};

export default Sidebar;
