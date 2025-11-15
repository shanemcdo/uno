import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'
import type { Message, OtherPlayerData, MessageRequest, NameRequest, ServerData, PlayCard, DrawCard } from './types';
import type { Card, Color, PlayedCard } from './deck';

import { For, Show, createSignal } from 'solid-js';
import { ServerType, ClientType, State } from './types';
import { CardType } from './deck';
import Messages from './Messages';
import StringInput from './StringInput';
import CardComponent from './CardComponent';
import ColorPicker from './ColorPicker';

import styles from './Game.module.scss'

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
	const [playableHand, setPlayableHand] = createSignal<boolean[]>([]);
	const [isAdmin, setIsAdmin] = createSignal(false);
	const [topCard, setTopCard] = createSignal<PlayedCard | null>(null);
	const [turnPlayerName, setTurnPlayerName] = createSignal('');
	const [otherPlayers, setOtherPlayers] = createSignal<OtherPlayerData[]>([]);
	const [colorPickerCallback, setColorPickerCallback] = createSignal<((color: Color) => void) | null>(null);
	const turnLabel = () => yourTurn() ? 'Your Turn' : `${turnPlayerName()}'s turn`;
	const waiting = () => state() === State.Waiting;
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
			setPlayableHand(d.playableHand);
			setIsAdmin(d.isAdmin);
			setTopCard(d.topCard);
			setTurnPlayerName(d.turnPlayerName);
			setOtherPlayers(d.otherPlayers);
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
			<h2>{turnLabel()}</h2>
			<Show when={topCard() !== null}>
				<div class={styles.top_card}>
					TopCard:
					<CardComponent card={topCard()!} />
				</div>
			</Show>
			<div class={styles.hand} data-card-count={hand().length}>
				<For each={hand()}>{ (card, index) =>
					<CardComponent
						card={card}
						disabled={!yourTurn() || !playableHand()[index()]}
						onclick={() => {
							if(card.type === CardType.Wild) {
								setColorPickerCallback(() => (color: Color) => {
									props.conn.send({
										type: ClientType.PlayCard,
										index: index(),
										color,
									} as PlayCard);
									setColorPickerCallback(null);
								});
							} else {
								props.conn.send({
									type: ClientType.PlayCard,
									index: index(),
								} as PlayCard);
							}
						}
					}/>
				}</For>
			</div>
			<button
				class={styles.draw_button}
				disabled={!yourTurn()}
				onclick={() => {
					props.conn.send({ 
						type: ClientType.DrawCard,
					} as DrawCard);
				}}
			>Draw Card</button>
			<Show when={colorPickerCallback()}>
				<ColorPicker callback={colorPickerCallback()!} cancelCallback={() => setColorPickerCallback(null)} />
			</Show>
			<Messages
				sendMessage={ message => {
					props.conn.send({ type: ClientType.Message, message } as MessageRequest);
				}}
				messages={messages()}
			/>
			<Show when={waiting()}>
				<div class={styles.waiting}>
					<h1>Waiting for more players to join...</h1>
				</div>
			</Show>
		</Show>
	</>;
};

export default Game;
