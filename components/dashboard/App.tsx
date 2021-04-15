import { dashboardProps } from "./types";
import styled from "styled-components";
import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { H1, H3 } from "../shared/styles/headings";
import Anchor from "../shared/ui-components/Anchor";
import {
	SearchBox,
	BooleanSetting,
	ColorSetting,
	ListSetting,
	RangeSetting,
	SelectSetting,
} from "disstreamchat-utils";
import { authContext } from "../../auth/authContext";
import firebaseClient from "../../firebase/client";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { gapFunction } from "../shared/styles";
import { useRouter } from "next/router";
import { Action } from "../../utils/types";
import { isEqual } from "lodash";
import SaveBar from "../shared/ui-components/SaveBar";
import { settings } from "cluster";

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
	gap: 2rem;
	width: 100%;
`;

const Settings = styled.ul`
	width: 100%;
`;

const SettingSidebar = styled.ul`
	background: #101010;
	height: fit-content;
	padding: 1rem !important;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	min-width: 15%;
	margin-top: 1rem !important;
	box-shadow: 3px 3px 5px 0 #111;
	position: sticky;
	top: 6rem;
	${gapFunction({ gap: "1rem" })}
`;

const CategoryItem = styled.li`
	text-transform: capitalize;
	width: 100%;
	a {
		text-decoration: none;
		display: block;
		background: #2a2c30;
		/* margin-top: 1rem; */
		border-radius: 0.25rem;
		text-align: center;
		padding: 0.35rem 0.25rem;
		width: 100%;
		position: relative;
		&:hover:before {
			opacity: 0;
		}
		&:focus {
			&:before {
				opacity: 0;
			}
			&:after {
				clip-path: circle(50% at 50% 50%);
			}
		}
		&:before {
			transition: all 0.125s ease-in-out;
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #00000033;
			border-radius: 0.25rem;
		}
		&:after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #00000033;
			border-radius: 0.25rem;
			clip-path: circle(0% at 50% 50%);
		}
	}
	&.active {
		a {
			background: var(--disstreamchat-purple);
		}
	}
`;

interface Setting {
	category: string;
	name: string;
	type: string;
	value?: string | { [key: string]: any };
	placeholder?: string;
	min?: number;
	max: number;
	options?: any[];
	open?: boolean;
}

interface SettingProps extends Setting {
	onClick: (name: string) => void;
	onChange: (name: string, val: any) => void;
	defaultValue?: string;
}

interface AppProps extends dashboardProps {
	settings: { [key: string]: any };
	categories: string[];
}

const settingMap = {
	boolean: BooleanSetting,
	color: ColorSetting,
	number: RangeSetting,
	list: ListSetting,
	selector: SelectSetting,
};

const SettingComponent = (props: SettingProps) => {
	const { type } = props;
	const Elt = useMemo(() => settingMap[type], [type]);
	let val = props.value;
	console.log(props.category)
	if (type === "selector") val = { label: props.value, value: props.value };
	return Elt ? <Elt {...props} value={val}></Elt> : <></>;
};

enum Actions {
	UPDATE = "update",
	SET = "set",
	RESET = "reset",
}

const settingReducer = (state, action: Action) => {
	switch (action.type) {
		case Actions.UPDATE:
			return {
				...state,
				[action.key]:
					typeof action.value === "function"
						? action.value(state[action.key])
						: action.value,
			};
		case Actions.SET:
			return action.value;
		default:
			return state;
	}
};

const App = (props: AppProps) => {
	const router = useRouter();

	const [, category] = router.query.type as string[];
	const [state, dispatch] = useReducer(settingReducer, {});

	const [search, setSearch] = useState("");
	const { user } = useContext(authContext);
	const [openItem, setOpenItem] = useState("");

	const [data, loading, error] = useDocumentData(
		firebaseClient.db.collection("Streamers").doc(user?.uid)
	);

	const { settings: defaultSettings, categories } = props;

	const allSettings: Setting[] = Object.entries(defaultSettings)
		.map(([key, val]) => ({
			...val,
			name: key,
		}))
		.sort((a, b) => {
			const categoryOrder = a.type.localeCompare(b.type);
			const nameOrder = a.name.localeCompare(b.name);
			return !!categoryOrder ? categoryOrder : nameOrder;
		})
		.filter(setting => {
			if (category === "all") return true;
			return setting.category?.includes?.(category);
		})
		.filter(setting => {
			return setting.name
				.match(/[A-Z][a-z]+|[0-9]+/g)
				.join(" ")
				.toLowerCase()
				.includes(search.toLowerCase());
		});

	const appSettings = data?.appSettings;
	useEffect(() => {
		if (appSettings) {
			dispatch({ type: Actions.SET, value: appSettings });
		}
	}, [appSettings]);

	const changed = appSettings && !isEqual(appSettings, state);

	const save = async () => {
		firebaseClient.db.collection("Streamers").doc(user.uid).set(
			{
				appSettings: state,
			},
			{ merge: true }
		);
	};

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
				<SettingSidebar>
					{categories?.map(cat => (
						<CategoryItem key={cat} className={`${cat === category ? "active" : ""}`}>
							<Anchor href={`/dashboard/app/${cat.toLowerCase()}`}>{cat}</Anchor>
						</CategoryItem>
					))}
				</SettingSidebar>
				<Settings>
					{allSettings.map(setting => (
						<SettingComponent
							{...setting}
							open={openItem === setting.name}
							onClick={name => setOpenItem(prev => (prev === name ? null : name))}
							value={state[setting.name]}
							//@ts-ignore
							defaultValue={setting.value}
							options={setting.options?.map(option => ({
								value: option,
								label: option,
							}))}
							onChange={(name, val) => {
								if (val.value) val = val.value;
								dispatch({ type: Actions.UPDATE, key: setting.name, value: val });
							}}
						></SettingComponent>
					))}
				</Settings>
			</SettingsContainer>
			<SaveBar
				changed={changed}
				save={save}
				reset={() => {
					dispatch({ type: Actions.SET, value: appSettings });
				}}
			/>
		</AppContainer>
	);
};

export default App;
