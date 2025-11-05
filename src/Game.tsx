import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'
import type { Message, MessageRequest, NameRequest, ServerData } from './types';

import { Show, createSignal } from 'solid-js';
import { ServerType, ClientType } from './types';
import Messages from './Messages';
import StringInput from './StringInput';

type Props = {
	conn: DataConnection,
};

const Game: Component<Props> = props => {
	const url = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('id', props.conn.peer);
		return url.href;
		
	};
	const [name, setName] = createSignal<null | string>(null);
	const [messages, setMessages] = createSignal<Message[]>([]);
	const addMessage = (message: Message) => {
		setMessages([...messages(), message]);
	}
	window.addEventListener('beforeunload', () => {
		props.conn.close();
	});
	props.conn.on('data', data => {
		const d = data as ServerData;
		switch(d.type) {
		case ServerType.Name:
			if(d.accepted) setName(d.name);
			break;
		case ServerType.Message:
			addMessage(d);
			break;
		}
	});
	return <>
		{props.conn.peer}
		<Show
			when={ name() }
			fallback={
				<StringInput
					placeholder="Enter Name"
					callback={ name => {
						props.conn.send({ type: ClientType.Name, name } as NameRequest);
					}}
				/>
			}
			>
			<h2>{name()}</h2>
			<StringInput
				placeholder="Enter Message"
				clearOnSend={true}
				callback={ message => {
					props.conn.send({ type: ClientType.Message, message } as MessageRequest);
				}}
			/>
			<input
				type="button"
				value="Close"
				onclick={() => {
					props.conn.close();
				}}
			/>
			<a
				href={url()}
				target="_blank"
			>Sharable Link</a>
			<Messages messages={messages()} />
		</Show>
	</>;
};

export default Game;
