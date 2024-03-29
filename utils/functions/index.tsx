export const getServerIconUrl = (icon: string, id: string) =>
	`https://cdn.discordapp.com/icons/${id}/${icon}`;

export const transformObjectToSelectValue = (obj, key = "id") => {
	return `${obj[key]}=${JSON.stringify(obj)}`;
};

export function getOS() {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
		windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
		iosPlatforms = ["iPhone", "iPad", "iPod"],
		os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = "Mac OS";
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = "iOS";
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = "Windows";
	} else if (/Android/.test(userAgent)) {
		os = "Android";
	} else if (!os && /Linux/.test(platform)) {
		os = "Linux";
	}

	return os;
}

export const ArrayAny = (arr1, arr2) => arr1.some(v => arr2.indexOf(v) >= 0);

export const TransformObjectToSelectValue = (obj, key = "id") => {
	return `${obj[key]}=${JSON.stringify(obj)}`;
};

// export const guildOption = guild => {
// 	if (!guild) return null;
// 	const size = 40;
// 	return {
// 		value: guild.name,
// 		label: (
// 			<span style={{ height: size, display: "flex", alignItems: "center" }}>
// 				<GuildIcon size={size} {...guild} />
// 				{guild.name}
// 			</span>
// 		),
// 	};
// };

export const channelLabel = channel => {
	return (
		<span>
			{channel.name} <span className="channel-category">{channel.parent}</span>
		</span>
	);
};

export const parseSelectValue = (value, notId = false) => {
	if (value instanceof Array) {
		if (value.length === 0) return value;
		return value
			.map(role => JSON.parse(role.value.split("=")[1]))
			.map(val => (notId ? val : val.id));
	} else {
		try {
			const val = JSON.parse(value.value.split("=")[1]);
			return notId ? val : val.id;
		} catch (err) {
			return null;
		}
	}
};

export const defined = item => (item ?? false) !== false || !!item === item;

export const getXp = level => (5 / 6) * level * (2 * level * level + 27 * level + 91);

export const map = (n, start1, stop1, start2, stop2) =>
	((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

export const getLevel = xp => Math.max(0, Math.floor(Math.log(xp - 100)));
