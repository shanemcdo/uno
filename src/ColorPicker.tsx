import type { Component } from 'solid-js'

import { Color } from './deck';
import styles from './ColorPicker.module.scss'

type Props = {
	callback: (color: Color) => void,
};

const ColorPicker: Component<Props> = props => {
	return <div class={styles.color_picker}>
		<h2>Color Picker</h2>
		<p onclick={() => props.callback(Color.Red)}>Red</p>
		<p onclick={() => props.callback(Color.Blue)}>Blue</p>
		<p onclick={() => props.callback(Color.Green)}>Green</p>
		<p onclick={() => props.callback(Color.Yellow)}>Yellow</p>
	</div>;
}

export default ColorPicker;
