import type { Component, ParentProps, JSX } from 'solid-js';

import { Show, createSignal } from 'solid-js';

import styles from './Modal.module.scss';

type Props = ParentProps<{
	button: JSX.Element,
	active?: boolean
}>;

const Popout: Component<Props> = props => {
	const [active, setActive] = createSignal(props.active ?? false);
	const toggleActive = () => setActive(prev => !prev);
	return <>
	<span
		class={styles.toggle}
		onclick={toggleActive}
	>{props.button}</span>
	<Show when={active()}>
		<div class={styles.modal}>
			{props.children}
		</div>
	</Show>
	</>;
};

export default Popout;
