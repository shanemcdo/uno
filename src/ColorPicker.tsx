import type { Component } from 'solid-js'

import { Color } from './deck';
import styles from './ColorPicker.module.scss'


type Props = {
	callback: (color: Color) => void,
};

type ChoiceProps = Props & {
	color: Color,
};

const Choice: Component<ChoiceProps> = props =>
	<div data-color={props.color} class={styles.choice} onclick={() => props.callback(props.color)} />;

const ColorPicker: Component<Props> = props => {
	return <div class={styles.color_picker}>
		<h2>Wild Color Picker:</h2>
		<div class={styles.choices}>
			<Choice callback={props.callback} color={Color.Red} />
			<Choice callback={props.callback} color={Color.Blue} />
			<Choice callback={props.callback} color={Color.Green} />
			<Choice callback={props.callback} color={Color.Yellow} />
		</div>
	</div>;
}

export default ColorPicker;
