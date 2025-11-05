import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'
import type { Message, OtherPlayerData, MessageRequest, NameRequest, ServerData } from './types';
import type { Card } from './deck';

import { Show, createSignal } from 'solid-js';
import { ServerType, ClientType, State } from './types';
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
	const [state, setState] = createSignal(State.Waiting);
	const [yourTurn, setYourTurn] = createSignal(false);
	const [hand, setHand] = createSignal<Card[]>([]);
	const [isAdmin, setIsAdmin] = createSignal(false);
	const [topCard, setTopCard] = createSignal<Card | null>(null);
	const [otherPlayers, setOtherPlayers] = createSignal<OtherPlayerData[]>([]);
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
		case ServerType.Update:
			setState(d.state);
			setYourTurn(d.yourTurn);
			setHand(d.yourHand);
			setIsAdmin(d.isAdmin);
			setTopCard(d.topCard);
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
