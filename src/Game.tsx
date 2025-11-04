import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

import { Show, createSignal } from 'solid-js';
import Messages from './Messages';
import StringInput from './StringInput';

type GameProps = {
	conn: DataConnection,
};

type NameData = {
	type: 'name',
	accepted: boolean,
	name: string,
};

type MessageData = {
	type: 'message',
	name: string,
	message: string,
};

type Data = NameData | MessageData;

type Message = {
	name: string,
	message: string,
};

const Game: Component<GameProps> = props => {
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
		const d = data as Data;
		switch(d.type) {
		case "name":
			if(d.accepted) setName(d.name);
			break;
		case "message":
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
					props.conn.send({ type: 'name', name });
				}} />
			}
			>
			<h2>{name()}</h2>
			<input
				type="button"
				value="Click me"
				onclick={() => {
					props.conn.send({
						type: 'message',
						name: name()!,
						message: 'This is a test!',
					});
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
