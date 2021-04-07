import { dashboardProps } from "./types";
import styled from "styled-components";
import React, { useState } from "react";
import { H1, H3 } from "../shared/styles/headings";
import Anchor from "../shared/ui-components/Anchor";
import { SearchBox } from "disstreamchat-utils";

const AppContainer = styled.main`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-left: 1rem;
	padding: 0 0.5rem 0.5rem;
	h3 {
		font-weight: normal;
	}
	a {
		text-decoration: underline;
	}
`;

const AppHeader = styled.div`
	width: 100%;
`;

const SettingsContainer = styled.div`
	display: flex;
`;

const Settings = styled.div``;

const SettingSidebar = styled.div`
	margin-right: 1rem;
	background: #101010;
	height: fit-content;
	padding: 1rem;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	min-width: 15%;
	margin-top: 1rem;
	box-shadow: 3px 3px 5px 0 #111;
	position: sticky;
	top: 1rem;
`;

const App = (props: dashboardProps) => {
	const [search, setSearch] = useState("");

	return (
		<AppContainer>
			<AppHeader>
				<H1>App Settings</H1>
				<H3>
					Adjust the settings of your app. if you don't use the app but want to you can
					start using it{" "}
					<Anchor href="/apps/download" className="ul bld" newTab>
						here
					</Anchor>
				</H3>
				<hr></hr>
			</AppHeader>
			<SearchBox
				search={search}
				onChange={val => setSearch(val)}
				resetSearch={() => setSearch("")}
			></SearchBox>
			<SettingsContainer>
				<SettingSidebar></SettingSidebar>
				<Settings></Settings>
			</SettingsContainer>
		</AppContainer>
	);
};

export default App;
