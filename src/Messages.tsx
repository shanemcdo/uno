import type { Component } from 'solid-js';
import type { Message } from './types';

import { For } from 'solid-js';
import StringInput from './StringInput';

type Props = {
	sendMessage: (message: string) => void,
	messages: Message[],
};

const Messages: Component<Props> = props => {
	return <div>
		<For each={props.messages} >{item =>
			<p>{item.name}: {item.message}</p>
		}</For>
		<StringInput
			placeholder="Enter Message"
			clearOnSend={true}
			callback={props.sendMessage}
		/>
	</div>
};

export default Messages;
