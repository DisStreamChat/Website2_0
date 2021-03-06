
export const getServerIconUrl = (icon: string, id: string) => `https://cdn.discordapp.com/icons/${id}/${icon}`

export const transformObjectToSelectValue = (obj, key="id") => {
	return `${obj[key]}=${JSON.stringify(obj)}`
}

export const parseSelectValue = value => {
	if (value instanceof Array) {
		if (value.length === 0) return value;
		return value.map(role => JSON.parse(role.value.split("=")[1])).map(val => val.id);
	} else {
		try {
			return JSON.parse(value.value.split("=")[1]).id;
		} catch (err) {
			return null;
		}
	}
};

export const ArrayAny = (arr1: any[], arr2: any[]) => arr1.some(v => arr2.indexOf(v) >= 0);