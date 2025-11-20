export function rand(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

export function choose<T>(arr: readonly T[]): T | undefined {
	if(arr.length < 1) {
		return undefined;
	}
	const idx = rand(0, arr.length);
	return arr[idx];
};
