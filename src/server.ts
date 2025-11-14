import type { DataConnection } from 'peerjs';
import type { ClientData, MessageBroadcast, NameValidation, GameUpdate, PlayCard, OtherPlayerData, DrawCard, DrawInfo } from './types';
import type { Card, PlayedCard } from './deck';

import { ServerType, ClientType, State, DrawType } from './types';
import { Peer } from 'peerjs';
import { ActionType, CardType, WildType, canPlayCard, deck } from './deck';
import deepClone from './deepClone';
import rand from './rand';

type PlayerData = {
	conn: DataConnection
	name: string,
	hand: Card[],
	isAdmin: boolean,
};

enum Direction {
	Forward,
	Backward,
};

const STARTING_HAND_SIZE = 7;

const playerData: Record<string, PlayerData> = {};
const turns: string[] = [];
let turn: string | null = null;
let currentDeck: Card[] = shuffle(deepClone(deck));
let topCard = drawNonWildCard();
let direction = Direction.Forward;
let drawInfo: DrawInfo = { type: DrawType.None };

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle<T>(arr: T[]): T[] {
	for(let i = arr.length - 1; i >= 1; i--) {
		const j = rand(0, i + 1);
		if(i === j) continue;
		[ arr[i], arr[j] ] = [ arr[j], arr[i] ];
	}
	return arr;
}

function drawNonWildCard(): PlayedCard {
	const card = drawCard();
	if(card.type !== CardType.Wild) {
		return card;
	}
	return drawNonWildCard();
}

function drawCard(): Card {
	if(currentDeck.length < 1) {
		currentDeck = shuffle(deepClone(deck));
	}
	const card = currentDeck.pop();
	return card!;
}

function drawCards(count: number): Card[] {
	const result = [];
	for(let i = 0; i < count; i++) {
		result.push(drawCard());
	}
	return result;
}

function nameExists(name: string): boolean {
	for(const player of Object.values(playerData)) {
		if(player.name === name) return true;
	}
	return false;
}

function sendUpdate() {
	Object.entries(playerData).forEach(([id, player]) => {
		player.conn.send({
			type: ServerType.Update,
			state: State.Waiting,
			yourTurn: turn === id,
			yourHand: player.hand,
			playableHand: player.hand.map(card => canPlayCard(topCard, card, drawInfo)),
			isAdmin: player.isAdmin,
			topCard,
			turnPlayerName: playerData[turn!].name,
			otherPlayers: Object.entries(playerData)
				.filter(([ other_id, _ ]) => id !== other_id )
				.map(([ _, other ]) => ({
					name: other.name,
					cardCount: other.hand.length,
				} as OtherPlayerData)),
			drawInfo,
		} as GameUpdate);
	});
}

function handlePlayCard(player_id: string,  event: PlayCard) {
	if(turn !== player_id) {
		console.error('User tried to play a card out of turn');
		return;
	}
	const player = playerData[player_id]
	const card = player.hand[event.index];
	let skip = false;
	if(!canPlayCard(topCard, card, drawInfo)) {
		console.error('User tried to play a card they are not allowed to');
		return;
	}
	player.hand.splice(event.index, 1);
	if(card.type !== CardType.Wild) {
		topCard = card;
		if(card.type === CardType.Action) {
			switch(card.action){
			case ActionType.Draw2:
				let count = 0;
				if(drawInfo.type === DrawType.Plus2) {
					count = drawInfo.count;
				} else if(drawInfo.type === DrawType.Plus4) {
					console.error('Player successfully played a +2 on a +4 somehow');
				}
				count += 2;
				drawInfo = {
					type: DrawType.Plus2,
					count,
				};
				break;
			case ActionType.Skip:
				skip = true;
				break;
			case ActionType.Reverse:
				direction = direction === Direction.Forward ?
					Direction.Backward :
					Direction.Forward;
				break;
			};
		}
	} else {
		if(card.wildType === WildType.WildDraw4) {
			let count = 0;
			if(drawInfo.type === DrawType.Plus2 || drawInfo.type == DrawType.Plus4) {
				count = drawInfo.count; 
			}
			count += 4;
			drawInfo = {
				type: DrawType.Plus4,
				count,
			};
		}
		topCard = {
			color: event.color!,
			...card,
		};
	}
	getNextTurn(skip);
	sendUpdate();
}

function handleDrawCard(player_id: string,  event: DrawCard) {
	if(turn !== player_id) {
		console.error('User tried to draw a card out of turn');
		return;
	}
	const player = playerData[player_id];
	switch(drawInfo.type) {
	case DrawType.None:
		player.hand.push(drawCard());
		break;
	case DrawType.Plus2:
	case DrawType.Plus4:
		player.hand.push(...drawCards(drawInfo.count));
		drawInfo = { type: DrawType.None };
		break;
	}
	getNextTurn();
	sendUpdate();
}

function getNextTurn(skip: boolean = false): void {
	if(turn === null) throw Error('Turn is null when it shouldn\'t be');
	let index = turns.indexOf(turn)
	const x = skip ? 2 : 1;
	if(direction === Direction.Forward) { 
		index += x;
		index %= turns.length;
	} else {
		index -= x;
		while(index < 0) {
			index += turns.length;
		}
	}
	turn = turns[index];
}

export function createServer(callback: (id: string) => void): Peer {
	const peer = new Peer();
	peer.on('open', callback);
	peer.on('error', err => console.log(err.message));
	peer.on('close', () => console.log('server close'));
	peer.on('connection', conn => {
		conn.on('open', () => {
			console.log(conn.peer + ' open');
		})
		conn.on('data', data => {
			console.log(data);
			const d = data as ClientData;
			switch(d.type) {
			case ClientType.Name:
				const accepted = !nameExists(d.name);
				if(accepted) {
					const isAdmin = Object.keys(playerData).length === 0;
					if(turn === null) {
						turn = conn.peer;
					}
					turns.push(conn.peer);
					playerData[conn.peer] = {
						conn,
						name: d.name,
						hand: drawCards(7),
						isAdmin,
					};
					console.log(playerData);
					console.log(currentDeck);
				}
				conn.send({
					type: ServerType.Name,
					name: d.name,
					accepted,
				} as NameValidation);
				sendUpdate();
				break;
			case ClientType.Message:
				for(const player of Object.values(playerData)) {
					player.conn.send({
						type: ServerType.Message,
						message: d.message,
						name: playerData[conn.peer].name,
					} as MessageBroadcast);
				}
				break;
			case ClientType.PlayCard:
				handlePlayCard(conn.peer, d);
				break;
			case ClientType.DrawCard:
				handleDrawCard(conn.peer, d);
				break;
			}
		})
		conn.on('close', () => {
			console.log(playerData);
			delete playerData[conn.peer];
			console.log(playerData);
			console.log(conn.peer + ' close');
		})
		conn.on('error', err => console.log(err.message));
	});

	return peer;
};
