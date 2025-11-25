import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'
import type { Message, OtherPlayerData, MessageRequest, NameRequest, ServerData, PlayCard, DrawCard, RestartGame, AdminUpdates, AdminProps, GameData } from './types';
import type { Card, Color, PlayedCard } from './deck';

import { createStore } from 'solid-js/store';
import { For, Show, createSignal } from 'solid-js';
import { ServerType, ClientType, State } from './types';
import { CardType } from './deck';
import Messages from './Messages';
import StringInput from './StringInput';
import CardComponent from './CardComponent';
import ColorPicker from './ColorPicker';
import AdminControls from './AdminControls';

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
	const [gameData, setGameData] = createStore<GameData>({
		state: State.Waiting,
		yourTurn: false,
		hand: [],
		playableHand: [],
		isAdmin: false,
		turnPlayerName: '',
		otherPlayers: [],
	});
	const [colorPickerCallback, setColorPickerCallback] = createSignal<((color: Color) => void) | null>(null);
	const turnLabel = () => gameData.yourTurn ? 'Your Turn' : `${gameData.turnPlayerName}'s turn`;
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
			setGameData(d.gameData);
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
			<Show when={gameData.topCard !== undefined}>
				<div class={styles.top_card}>
					TopCard:
					<CardComponent card={gameData.topCard!} />
				</div>
			</Show>
			<div class={styles.hand} data-card-count={gameData.hand.length}>
				<For each={gameData.hand}>{ (card, index) =>
					<CardComponent
						card={card}
						disabled={!gameData.yourTurn || !gameData.playableHand[index()]}
						onclick={() => {
							if(!gameData.yourTurn) return;
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
				disabled={!gameData.yourTurn}
				onclick={() => {
					props.conn.send({ 
						type: ClientType.DrawCard,
					} as DrawCard);
				}}
			>Draw Card</button>
			<Show when={colorPickerCallback()}>
				<ColorPicker callback={colorPickerCallback()!} cancelCallback={() => setColorPickerCallback(null)} />
			</Show>
			<Show when={gameData.state === State.Waiting || gameData.state === State.GameOver}>
				<div class={styles.popup}>
					<Show when={gameData.state === State.Waiting}>
						<h1>Waiting for more players to join...</h1>
					</Show>
					<Show when={gameData.state === State.GameOver}>
						<h1>{gameData.winner} Won!</h1>
						<button
							onclick={() => {
								props.conn.send({ type: ClientType.RestartGame } as RestartGame);
							}}
						>Play again?</button>
					</Show>
				</div>
			</Show>
			<Show when={!(gameData.adminProps?.disableChat ?? false)}>
				<Messages
					sendMessage={ message => {
						props.conn.send({ type: ClientType.Message, message } as MessageRequest);
					}}
					messages={messages()}
				/>
			</Show>
			<Show when={gameData.adminProps !== undefined}>
				<AdminControls
					isAdmin={gameData.isAdmin}
					startingProps={gameData.adminProps!}
					callback={(adminProps: AdminProps) => {
						props.conn.send({
							type: ClientType.AdminUpdates,
							...adminProps,
						} as AdminUpdates);
					}
				} />
			</Show>
		</Show>
	</>;
};

export default Game;
