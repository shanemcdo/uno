import type { Component } from 'solid-js';
import type { Message } from './types';

import { For } from 'solid-js';
import StringInput from './StringInput';

import styles from './Messages.module.scss';
import Popout, { Location } from './Popout';

type Props = {
	sendMessage: (message: string) => void,
	messages: Message[],
};

const Messages: Component<Props> = props => {
	return <>
		<Popout location={Location.Left}>
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
		</Popout>
	</>
};

export default Messages;
