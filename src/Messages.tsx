import type { Component } from 'solid-js';
import type { Message } from './types';

import { For, Show, createSignal } from 'solid-js';
import StringInput from './StringInput';

import styles from './Messages.module.scss';

type Props = {
	sendMessage: (message: string) => void,
	messages: Message[],
};

const Messages: Component<Props> = props => {
	const [active, setActive] = createSignal(false);
	const toggleActive = () => setActive(prev => !prev);
	const messagesClasses = () => `${styles.container} ${active() ? styles.active: ''}`;
	return <>
	<div class={messagesClasses()}>
		<button
			onclick={toggleActive}
		>X</button>
		<div class={styles.messages}>
			<For each={props.messages} >{item =>
				<p>{item.name}: {item.message}</p>
			}</For>
		</div>
		<StringInput
			placeholder="Enter Message"
			clearOnSend={true}
			callback={props.sendMessage}
		/>
	</div>
	<Show when={!active()}>
		<div
			class={styles.toggle}
			onclick={toggleActive}
		>V</div>
	</Show>
	</>
};

export default Messages;
