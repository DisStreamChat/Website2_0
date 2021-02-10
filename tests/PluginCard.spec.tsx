import React from "react";

import { render } from "../utils/test-utils";
import PluginCard, { pluginProps } from "../components/dashboard/Discord/PluginItem";

describe("Plugin Card", () => {
	let expectedProps: pluginProps;

	beforeEach(() => {
		expectedProps = {
			id: "welcome",
			title: "Welcome",
			image: "wave.svg",
			description: "Welcome users to your server",
			comingSoon: false,
			active: true,
		};
	});

	test("should render title and description", () => {
		const {getByText, getByAltText} = render(<PluginCard {...expectedProps}/>)
		const title = getByText(expectedProps.title)
		const description = getByText(expectedProps.description)
		const image = getByAltText(expectedProps.title)

		expect(title).toBeVisible()
		expect(description).toBeVisible()
		expect(image).toBeVisible()
	})

	test("switch should have the correct checked value", () => {
		const {getByLabelText} = render(<PluginCard {...expectedProps}/>)
		const activitySwitch = getByLabelText(`${expectedProps.title} activity switch`) as HTMLInputElement

		expect(activitySwitch.checked).toBe(true)
	})

	test("switch should correctly toggle the checked value", () => {
		const {getByLabelText} = render(<PluginCard {...expectedProps}/>)
		const activitySwitch = getByLabelText(`${expectedProps.title} activity switch`) as HTMLInputElement

		activitySwitch.click()

		expect(activitySwitch.checked).toBe(false)
	})

	test("switch should be disabled if coming soon", () => {
		expectedProps.comingSoon = true
		const {getByLabelText} = render(<PluginCard {...expectedProps}/>)
		const activitySwitch = getByLabelText(`${expectedProps.title} activity switch`) as HTMLInputElement

		expect(activitySwitch).toBeDisabled()
	})
});
