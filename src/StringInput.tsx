import type { Component } from 'solid-js';

import { createSignal, mergeProps } from 'solid-js';

type Props = {
	placeholder: string,
	callback: (arg: string) => void,
	clearOnSend?: boolean,
	allowEmptyInput?: boolean,
	buttonText?: string,
};

const StringInput: Component<Props> = p => {
	const props = mergeProps({
		clearOnSend: true,
		allowEmptyInput: false,
		buttonText: 'Submit',
	}, p)
	const [buttonDisabled, setButtonDisabled] = createSignal(true);
	const onclick = () => {
		props.callback(input.value);
		if(props.clearOnSend) {
			input.value = '';
			setButtonDisabled(!props.allowEmptyInput);
		}
	}
	const input = <input
		type="text"
		placeholder={props.placeholder}
		onkeypress={event => {
			if(event.key === 'Enter' && (props.allowEmptyInput || input.value !== '')) {
				onclick();
				event.preventDefault();
			}
		}}
		oninput={event => {
			if(!props.allowEmptyInput) setButtonDisabled(event.target.value === '');
		}}
	/> as HTMLInputElement;
	return <>
		{ input }
		<input
			type="button"
			onclick={ onclick }
			disabled={ buttonDisabled() }
			value={ props.buttonText }
		/>
	</>;
};

export default StringInput;
