import type { Component } from 'solid-js';

import { Show, createSignal } from 'solid-js';

import styles from './AdminControls.module.scss';

const AdminControls: Component = () => {
	const [active, setActive] = createSignal(false);
	const toggleActive = () => setActive(prev => !prev);
	const adminControlsClasses = () => `${styles.container} ${active() ? styles.active: ''}`;
	return <>
	<div class={adminControlsClasses()}>
		<button
			onclick={toggleActive}
		>X</button>
		<h1>Admin Controls</h1>
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
