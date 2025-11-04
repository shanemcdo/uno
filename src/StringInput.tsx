import type { Component } from "solid-js";

type Props = {
	placeholder: string,
	callback: (arg: string) => void,
};

const StringInput: Component<Props> = props => {
	const input = <input type="text" placeholder={props.placeholder} /> as HTMLInputElement;
	return <>
		{input}
		<button
			onclick={ () => props.callback(input.value) }
		>Submit</button>
	</>;
};

export default StringInput;
