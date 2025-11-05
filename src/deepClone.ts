// https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/
// https://stackoverflow.com/questions/42999983/typescript-removing-readonly-modifier#43001581
type DeepClone<T> = T extends object ?
	{ -readonly [K in keyof T]: DeepClone<T[K]> } :
	T;
export default function deepClone<T>(obj: T): DeepClone<T> {
	return JSON.parse(JSON.stringify(obj));
}
