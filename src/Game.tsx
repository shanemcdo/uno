import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'
import type { Message, MessageRequest, NameRequest, ServerData, PlayCard, DrawCard, RestartGame, AdminUpdates, AdminProps, GameData } from './types';
import type { Color } from './deck';

import { createStore } from 'solid-js/store';
import { For, Index, Show, createSignal } from 'solid-js';
import { FaBrandsGithub, FaSolidArrowRotateLeft, FaSolidArrowRotateRight, FaSolidGear, FaSolidShareFromSquare } from 'solid-icons/fa'
import { IoCloseCircle } from 'solid-icons/io'
import { ServerType, ClientType, State, Direction } from './types';
import { CardType } from './deck';
import Messages from './Messages';
import StringInput from './StringInput';
import CardComponent from './CardComponent';
import ColorPicker from './ColorPicker';
import AdminControls from './AdminControls';
import Repeat from './Repeat';

import styles from './Game.module.scss'
import { rand } from './rand';

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
		topCards: [],
	});
	const [colorPickerCallback, setColorPickerCallback] = createSignal<((color: Color) => void) | null>(null);
	const turnLabel = () => (gameData.yourTurn ? 'Your' : `${gameData.turnPlayerName}'s`) + ' Turn';
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

	const nameInput =
		<div class={styles.name_input}>
			<div>
				<h1>Enter Name</h1>
				<StringInput
					placeholder="Enter Name"
					callback={ name => {
						props.conn.send({ type: ClientType.Name, name } as NameRequest);
					}}
				/>
			</div>
		</div>;

	const otherPlayers =
		<div class={styles.other_players} data-player-count={gameData.otherPlayers.length}>
			<For each={gameData.otherPlayers}>{ otherPlayer => {
				return <div class={styles.other_player}>
					<h3>{otherPlayer.name}</h3>
					<div class={styles.other_player_hand} data-card-count={otherPlayer.cardCount}>
						<Repeat count={otherPlayer.cardCount}>
							<CardComponent />
						</Repeat>
					</div>
				</div>;
			}}</For>
		</div>;

	const toolbar =
		<div class={styles.toolbar}>
			<a
				onclick={() => {
					props.conn.close();
				}}
			><IoCloseCircle /></a>
			<a
				onclick={() => {
					// TODO: open popup for this
				}}
			><FaSolidGear /></a>
			<a
				href="https://github.com/shanemcdo/uno/"
				target="_blank"
			><FaBrandsGithub /></a>
			<a
				href={url()}
				target="_blank"
			><FaSolidShareFromSquare /></a>
		</div>;

	const direction_indicator =
		<span class={styles.direction_indicator}>
			<Show
				when={gameData.direction === Direction.Forward}
				fallback={<FaSolidArrowRotateLeft />}
			>
				<FaSolidArrowRotateRight />
			</Show>
		</span>;

	const topCard =
		<Show when={gameData.topCards.length > 0}>
			<div class={styles.top_card_wrapper}>
				<h2 data-your-turn={gameData.yourTurn}>{turnLabel()}</h2>
				{direction_indicator}
				<div class={styles.top_card}>
					<Index each={gameData.topCards}>{ card =>
						<div data-rotation={rand(-30, 30)}>
							<CardComponent card={card()} />
						</div>
					}</Index>
				</div>
			</div>
		</Show>;

	const hand =
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
		</div>;

	const drawCardButton =
		<button
			class={styles.draw_button}
			disabled={!gameData.yourTurn}
			onclick={() => {
				props.conn.send({
					type: ClientType.DrawCard,
				} as DrawCard);
			}}
		>Draw Card</button>;

	const colorPicker =
		<Show when={colorPickerCallback()}>
			<ColorPicker callback={colorPickerCallback()!} cancelCallback={() => setColorPickerCallback(null)} />
		</Show>;

	const popup =
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
		</Show>;

	const messageWindow =
		<Show when={!(gameData.adminProps?.disableChat ?? false)}>
			<Messages
				sendMessage={ message => {
					props.conn.send({ type: ClientType.Message, message } as MessageRequest);
				}}
				messages={messages()}
			/>
		</Show>;

	const adminPropsWindow =
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

	return <>
		<Show
			when={ name() }
			fallback={ nameInput }
		>
			{otherPlayers}
			{toolbar}
			{topCard}
			{hand}
			{drawCardButton}
			{colorPicker}
			{popup}
			{messageWindow}
			{adminPropsWindow}
		</Show>
	</>;
};

export default Game;
