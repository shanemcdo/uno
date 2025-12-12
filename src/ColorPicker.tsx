import type { Component } from 'solid-js'

import { Color } from './deck';
import styles from './ColorPicker.module.scss'


type Callback = (color: Color) => void;

type Props = {
	callback: Callback,
	cancelCallback: () => void,
};

type ChoiceProps = {
	color: Color,
};

const ColorPicker: Component<Props> = props => {
	const Choice: Component<ChoiceProps> = choiceProps =>
		<div data-color={choiceProps.color} class={styles.choice} onclick={() => props.callback(choiceProps.color)} />;

	return <div class={styles.color_picker}>
		<div class={styles.cancel_container}>
			<span
				class={styles.cancel}
				onclick={props.cancelCallback}
			>X</span>
		</div>
		<h2>Wild Color Picker:</h2>
		<div class={styles.choices}>
			<Choice color={Color.Red} />
			<Choice color={Color.Blue} />
			<Choice color={Color.Yellow} />
			<Choice color={Color.Green} />
		</div>
	</div>;
}

export default ColorPicker;
