import type { Component } from 'solid-js'

import { Color } from './deck';
import styles from './ColorPicker.module.scss'


type Callback = (color: Color) => void;

type Props = {
	callback: Callback,
	cancelCallback: () => void,
};

type ChoiceProps = {
	callback: Callback,
	color: Color,
};

const Choice: Component<ChoiceProps> = props =>
	<div data-color={props.color} class={styles.choice} onclick={() => props.callback(props.color)} />;

const ColorPicker: Component<Props> = props => {
	return <div class={styles.color_picker}>
		<div class={styles.cancel_container}>
			<span
				class={styles.cancel}
				onclick={props.cancelCallback}
			>X</span>
		</div>
		<h2>Wild Color Picker:</h2>
		<div class={styles.choices}>
			<Choice callback={props.callback} color={Color.Red} />
			<Choice callback={props.callback} color={Color.Blue} />
			<Choice callback={props.callback} color={Color.Yellow} />
			<Choice callback={props.callback} color={Color.Green} />
		</div>
	</div>;
}

export default ColorPicker;
