import type { DataConnection } from 'peerjs';
import type { ClientData, MessageBroadcast, NameValidation, GameUpdate } from './types';
import type { Card, PlayedCard } from './deck';

import { ServerType, ClientType, State } from './types';
import { Peer } from 'peerjs';
import { CardType, deck } from './deck';
import deepClone from './deepClone';
import rand from './rand';

type PlayerData = {
	conn: DataConnection
	name: string,
	hand: Card[],
};

const STARTING_HAND_SIZE = 7;

const playerData: Record<string, PlayerData> = {};
let turn: string | null = null;
let currentDeck: Card[] = shuffle(deepClone(deck));
let topCard = drawNonWildCard();

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
			isAdmin: false, // TODO
			topCard,
			otherPlayers: [], // TODO
		} as GameUpdate);
	});
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
					playerData[conn.peer] = {
						conn,
						name: d.name,
						hand: drawCards(7),
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
				// TODO handle playing card
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
