import type { Component } from 'solid-js';
import type { Message } from './Types';

import { For } from 'solid-js';

type Props = {
	messages: Message[],
};

const Messages: Component<Props> = props => {
	return <div>
		<For each={props.messages} >{item =>
			<p>{item.name}: {item.message}</p>
		}</For>
	</div>
};

export default Messages;
