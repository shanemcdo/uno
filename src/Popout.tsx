import type { Component, ParentProps } from 'solid-js';

import { children, Show, createSignal } from 'solid-js';

import styles from './Popout.module.scss';

export enum Location {
	Left = "left",
	Right = "right",
};

type Props = ParentProps<{
	location: Location,
}>;

const Popout: Component<Props> = props => {
	const [active, setActive] = createSignal(false);
	const toggleActive = () => setActive(prev => !prev);
	const popoutClasses = () => `${styles.container} ${active() ? styles.active: ''}`;
	const safeChildren = children(() => props.children);
	return <>
	<div class={popoutClasses()} data-direction={props.location}>
		<button
			class={styles.close}
			onclick={toggleActive}
		>X</button>
		{safeChildren()}
	</div>
	<Show when={!active()}>
		<div
			class={styles.toggle}
			onclick={toggleActive}
			data-direction={props.location}
		>{props.location === Location.Left ? '>' : '<'}</div>
	</Show>
	</>
};

export default Popout;
