import type { Accessor, Component, Setter } from 'solid-js';

import { For, Show, untrack } from 'solid-js';

import styles from './controls.module.scss';

export const CheckboxControls: Component<{
	accessor: Accessor<boolean>
	setter: Setter<boolean>
	label: string,
	disabled: boolean,
}> = props => {
	const id = props.label.replaceAll(' ', '-') + '-id';
	return <>
		<label for={id}>{props.label}</label>
		<div class={styles.input_wrapper}>
			<Show
				when={!props.disabled}
				fallback={
					<input
						type="checkbox"
						disabled
						checked={props.accessor()}
					/>
				}
			>
				<input
					id={id}
					type="checkbox"
					checked={untrack(props.accessor)}
					onchange={event => {
						props.setter(event.target.checked);
					}}
				/>
			</Show>
		</div>
	</>;
}

export const NumberControls: Component<{
	accessor: Accessor<number>
	setter: Setter<number>
	label: string,
	disabled: boolean,
}> = props => {
	const id = props.label.replaceAll(' ', '-') + '-id';
	return <>
		<label for={id}>{props.label}</label>
		<Show
			when={!props.disabled}
			fallback={
				<input
					type="number"
					disabled
					value={props.accessor()}
				/>
			}
		>
			<input
				id={id}
				type="number"
				value={untrack(props.accessor)}
				onchange={event => {
					if(event.target.valueAsNumber < 1) {
						event.target.valueAsNumber = 1;
					}
					props.setter(event.target.valueAsNumber);
				}}
			/>
		</Show>
	</>;
}

// converted to function for easier generics
export function DropDownControls<T extends Exclude<string, Function>>(props: {
	accessor: Accessor<T>
	setter: (val: T) => void, // Setter<T> doesn't work well with generics
	label: string,
	choices: readonly T[],
	disabled: boolean,
}) {
	const id = props.label.replaceAll(' ', '-') + '-id';
	return <>
		<label for={id}>{props.label}</label>
		<Show
			when={!props.disabled}
			fallback={
				<input
					disabled
					value={props.accessor()}
				/>
			}
		>
			<select
				id={id}
				value={untrack(props.accessor)}
				onchange={event => {
					props.setter(event.currentTarget.value as T);
				}}
			>
				<For each={props.choices}>{choice =>
					<option value={choice}>{choice}</option>
				}</For>
			</select>
		</Show>
	</>;
}
