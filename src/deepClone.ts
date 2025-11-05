// https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/
type DeepClone<T> = T extends object ?
	{ [K in keyof T]: DeepClone<T[K]> } :
	T;
export default function deepClone<T>(obj: T): DeepClone<T> {
	return JSON.parse(JSON.stringify(obj));
}
