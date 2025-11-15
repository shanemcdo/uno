import type { Component } from 'solid-js';

import { Show, createEffect, createSignal } from 'solid-js';
import { AdminProps } from './types';

import styles from './AdminControls.module.scss';

type Props = {
	callback: (adminProps: AdminProps) => void,
};

const AdminControls: Component<Props> = props => {
	const [active, setActive] = createSignal(false);
	const [stacking, setStacking] = createSignal(true);
	const [startingHandSize, setStartingHandSize] = createSignal(7);
	const [disableChat, setDisableChat] = createSignal(false);
	const toggleActive = () => setActive(prev => !prev);
	const adminControlsClasses = () => `${styles.container} ${active() ? styles.active: ''}`;

	createEffect(() => {
		props.callback({
			stacking: stacking(),
			startingHandSize: startingHandSize(),
			disableChat: disableChat(),
		} as AdminProps)
	})

	return <>
	<div class={adminControlsClasses()}>
		<button
			onclick={toggleActive}
		>X</button>
		<h1>Admin Controls</h1>
		<div class={styles.grid}>
			<label for="stacking-box">Stacking</label>
			<input id="stacking-box" type="checkbox" checked onchange={event => {
				setStacking(event.target.checked);
			}}/>
			<label for="starting-hand-size-input">Starting Hand Size</label>
			<input id="starting-hand-size-input" type="number" value={7} onchange={event => {
				if(event.target.valueAsNumber < 1) {
					event.target.valueAsNumber = 1;
				}
				setStartingHandSize(event.target.valueAsNumber);
			}}/>
			<label for="disable-chat-box">Disable Chat</label>
			<input id="disable-chat-box" type="checkbox" onchange={event => {
				setDisableChat(event.target.checked);
			}}/>
		</div>
	</div>
	<Show when={!active()}>
		<div
			class={styles.toggle}
			onclick={toggleActive}
		>V</div>
	</Show>
	</>
};

export default AdminControls;
