import type { Component } from "solid-js";

type Props = {
	placeholder: string,
	callback: (arg: string) => void,
	clearOnSend?: boolean,
};

const StringInput: Component<Props> = props => {
	const input = <input type="text" placeholder={props.placeholder} /> as HTMLInputElement;
	return <>
		{input}
		<button
			onclick={ () => {
				props.callback(input.value);
				if(props.clearOnSend) input.value = '';
			}}
		>Submit</button>
	</>;
};

export default StringInput;
