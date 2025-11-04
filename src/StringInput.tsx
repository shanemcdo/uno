import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';

type Props = {
	placeholder: string,
	callback: (arg: string) => void,
	clearOnSend?: boolean,
	allowEmptyInput?: boolean,
	buttonText?: string,
};

const StringInput: Component<Props> = props => {
	const [buttonDisabled, setButtonDisabled] = createSignal(true);
	const onclick = () => {
		props.callback(input.value);
		if(props.clearOnSend) {
			input.value = '';
			setButtonDisabled(true);
		}
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
		oninput={event => {
			if(props.allowEmptyInput ?? true) setButtonDisabled(event.target.value === '');
		}}
	/> as HTMLInputElement;
	return <>
		{ input }
		<input
			type="button"
			onclick={ onclick }
			disabled={ buttonDisabled() }
			value={ props.buttonText ?? 'Submit' }
		/>
	</>;
};

export default StringInput;
