import type { Component } from 'solid-js';

import { Show, createEffect, createSignal, untrack } from 'solid-js';
import { AdminProps } from './types';

import styles from './AdminControls.module.scss';

type Props = {
	isAdmin: boolean,
	startingProps: AdminProps,
	callback: (adminProps: AdminProps) => void,
};

const AdminControls: Component<Props> = props => {
	const [active, setActive] = createSignal(false);
	const [stacking, setStacking] = createSignal(props.startingProps.stacking);
	const [startingHandSize, setStartingHandSize] = createSignal(props.startingProps.startingHandSize);
	const [disableChat, setDisableChat] = createSignal(props.startingProps.disableChat);
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
			<Show
				when={props.isAdmin}
				fallback={
					<input
						type="checkbox"
						disabled
						checked={props.startingProps.stacking}
					/>
				}
			>
				<input
					id="stacking-box"
					type="checkbox"
					checked={untrack(stacking)}
					onchange={event => {
						setStacking(event.target.checked);
					}}
				/>
			</Show>
			<label for="starting-hand-size-input">Starting Hand Size</label>
			<Show
				when={props.isAdmin}
				fallback={
					<input
						type="number"
						disabled
						value={props.startingProps.startingHandSize}
					/>
				}
			>
				<input
					id="starting-hand-size-input"
					type="number"
					value={untrack(startingHandSize)}
					onchange={event => {
						if(event.target.valueAsNumber < 1) {
							event.target.valueAsNumber = 1;
						}
						setStartingHandSize(event.target.valueAsNumber);
					}}
				/>
			</Show>
			<label for="disable-chat-box">Disable Chat</label>
			<Show
				when={props.isAdmin}
				fallback={
					<input
						type="checkbox"
						disabled
						checked={props.startingProps.disableChat}
					/>
				}
			>
				<input
					id="disable-chat-box"
					type="checkbox"
					checked={untrack(disableChat)}
					onchange={event => {
						setDisableChat(event.target.checked);
					}}
				/>
			</Show>
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
