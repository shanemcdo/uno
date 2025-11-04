import type { Component } from "solid-js";

type Props = {
	placeholder: string,
	callback: (arg: string) => void,
	clearOnSend?: boolean,
};

const StringInput: Component<Props> = props => {
	const onclick = () => {
		props.callback(input.value);
		if(props.clearOnSend) input.value = '';
	}
	const input = <input
		type="text"
		placeholder={props.placeholder}
		onkeypress={event => {
			if(event.key === 'Enter') {
				onclick();
				event.preventDefault();
			}
		}}
	/> as HTMLInputElement;
	return <>
		{input}
		<button onclick={ onclick }>Submit</button>
	</>;
};

export default StringInput;
