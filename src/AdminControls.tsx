import type { Accessor, Component, Setter } from 'solid-js';

import { For, Show, createEffect, createSignal, untrack } from 'solid-js';
import { AdminProps, DrawCardMethod, drawCardMethods } from './types';

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
	const [drawCardMethod, setDrawCardMethod] = createSignal(props.startingProps.drawCardMethod);
	const toggleActive = () => setActive(prev => !prev);
	const adminControlsClasses = () => `${styles.container} ${active() ? styles.active: ''}`;

	createEffect(() => {
		props.callback({
			stacking: stacking(),
			startingHandSize: startingHandSize(),
			disableChat: disableChat(),
			twoPlayerReverseSkip: twoPlayerReverseSkip(),
			drawCardMethod: drawCardMethod(),
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
						type="number"
						disabled
						value={controlsProps.accessor()}
					/>
				}
			>
			<input
				id={id}
				type="number"
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

	const DropDownControls: Component<{
		accessor: Accessor<DrawCardMethod>
		setter: Setter<DrawCardMethod>
		label: string,
		choices: DrawCardMethod[],
	}> = controlsProps => {
		const id = controlsProps.label.replaceAll(' ', '-') + '-id';
		return <>
			<label for={id}>{controlsProps.label}</label>
			<Show
				when={props.isAdmin}
				fallback={
					<input
						disabled
						value={controlsProps.accessor()}
					/>
				}
			>
			<select
				id={id}
				value={untrack(controlsProps.accessor)}
				onchange={event => {
					controlsProps.setter(event.target.value as DrawCardMethod);
				}}
			>
				<For each={controlsProps.choices}>{choice =>
					<option value={choice}>{choice}</option>
				}</For>
			</select>
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
			<NumberControls
				label="Starting Hand Size"
				accessor={() => props.startingProps.startingHandSize}
				setter={setStartingHandSize}
			/>
			<CheckboxControls
				label="Disable Chat"
				accessor={() => props.startingProps.disableChat}
				setter={setDisableChat}
			/>
			<CheckboxControls
				label="Two Player Reverse Skip"
				accessor={() => props.startingProps.twoPlayerReverseSkip}
				setter={setTwoPlayerReverseSkip}
			/>
			<DropDownControls
				label="Draw Card Method"
				accessor={() => props.startingProps.drawCardMethod}
				setter={setDrawCardMethod}
				choices={drawCardMethods}
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
