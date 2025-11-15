import type { Accessor, Component, Setter } from 'solid-js';

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
	const [twoPlayerReverseSkip, setTwoPlayerReverseSkip] = createSignal(props.startingProps.twoPlayerReverseSkip);
	const toggleActive = () => setActive(prev => !prev);
	const adminControlsClasses = () => `${styles.container} ${active() ? styles.active: ''}`;

	createEffect(() => {
		props.callback({
			stacking: stacking(),
			startingHandSize: startingHandSize(),
			disableChat: disableChat(),
			twoPlayerReverseSkip: twoPlayerReverseSkip(),
		} as AdminProps)
	})

	const CheckboxControls: Component<{
		accessor: Accessor<boolean>
		setter: Setter<boolean>
		label: string,
	}> = controlsProps => {
		const id = controlsProps.label.replaceAll(' ', '-') + '-id';
		return <>
			<label for={id}>{controlsProps.label}</label>
			<Show
				when={props.isAdmin}
				fallback={
					<input
						type="checkbox"
						disabled
						checked={controlsProps.accessor()}
					/>
				}
			>
			<input
				id={id}
				type="checkbox"
				checked={untrack(controlsProps.accessor)}
				onchange={event => {
					controlsProps.setter(event.target.checked);
				}}
			/>
			</Show>
		</>;
	}

	const NumberControls: Component<{
		accessor: Accessor<number>
		setter: Setter<number>
		label: string,
	}> = controlsProps => {
		const id = controlsProps.label.replaceAll(' ', '-') + '-id';
		return <>
			<label for={id}>{controlsProps.label}</label>
			<Show
				when={props.isAdmin}
				fallback={
					<input
						type="checkbox"
						disabled
						value={controlsProps.accessor()}
					/>
				}
			>
			<input
				id={id}
				type="checkbox"
				value={untrack(controlsProps.accessor)}
				onchange={event => {
						if(event.target.valueAsNumber < 1) {
							event.target.valueAsNumber = 1;
					}
					controlsProps.setter(event.target.valueAsNumber);
				}}
			/>
			</Show>
		</>;
	}

	return <>
	<div class={adminControlsClasses()}>
		<button
			onclick={toggleActive}
		>X</button>
		<h1>Admin Controls</h1>
		<div class={styles.grid}>
			<CheckboxControls
				label="Stacking"
				accessor={() => props.startingProps.stacking}
				setter={setStacking}
			/>
			<label for="starting-hand-size-input">Starting Hand Size</label>
			<NumberControls
				label="Starting Hand Size"
				accessor={() => props.startingProps.startingHandSize}
				setter={setStartingHandSize}
			/>
			<CheckboxControls
				label="Disable-chat"
				accessor={() => props.startingProps.disableChat}
				setter={setDisableChat}
			/>
			<CheckboxControls
				label="Two Player Reverse Skip"
				accessor={() => props.startingProps.twoPlayerReverseSkip}
				setter={setTwoPlayerReverseSkip}
			/>
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
