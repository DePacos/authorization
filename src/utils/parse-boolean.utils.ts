export const parseBooleanUtils = (value: string): boolean => {
	if (value) {
		const lowerValue = value.trim().toLowerCase();

		if (lowerValue === 'true') return true;
		if (lowerValue === 'false') return false;
	}

	throw new Error(`cannot convert ${value} to boolean`);
};
