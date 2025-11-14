import type { Card, Color, PlayedCard } from "./deck";

export type Message = {
	name: string,
	message: string,
};

export type OtherPlayerData = {
	name: string,
	cardCount: number,
};

export enum State {
	Waiting,
	Playing,
	GameOver,
};

// sent by server side
export enum ServerType {
	Name,
	Message,
	Update,
};

export type NameValidation = {
	type: ServerType.Name,
	accepted: boolean,
	name: string,
};

export type MessageBroadcast = {
	type: ServerType.Message,
	name: string,
	message: string,
};

export type GameUpdate = {
	type: ServerType.Update,
	state: State,
	yourTurn: boolean,
	yourHand: Card[],
	playableHand: boolean[],
	isAdmin: boolean,
	topCard: PlayedCard,
	turnPlayerName: string,
	otherPlayers: OtherPlayerData[],
};

export type ServerData = NameValidation | MessageBroadcast | GameUpdate;

// sent by client side
export enum ClientType {
	Name,
	Message,
	PlayCard,
	DrawCard,
};

export type NameRequest = {
	type: ClientType.Name,
	name: string,
};

export type MessageRequest = {
	type: ClientType.Message,
	message: string,
};

export type PlayCard = {
	type: ClientType.PlayCard,
	index: number,
	color?: Color,
};

export type DrawCard = {
	type: ClientType.DrawCard,
};

export type ClientData = NameRequest | MessageRequest| PlayCard | DrawCard;
