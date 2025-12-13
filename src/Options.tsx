import type { Component } from 'solid-js';

import { createEffect, createSignal } from 'solid-js';
import { CheckboxControls } from './controls';

import styles from './Options.module.scss';

export type PlayerOptions = {
	hideChat: boolean,
};

type Props = {
	startingOptions: PlayerOptions,
	callback: (options: PlayerOptions) => void,
};

const Options: Component<Props> = props => {
	const [hideChat, setHideChat] = createSignal(false);

	createEffect(() => {
		props.callback({
			hideChat: hideChat(),
		} as PlayerOptions)
	})

	return <>
		<h1>Options</h1>
		<div class={styles.grid}>
			<CheckboxControls
				label="Hide Chat"
				accessor={hideChat}
				setter={setHideChat}
			/>
		</div>
	</>
};

export default Options;
