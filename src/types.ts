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

export enum DrawType {
	None,
	Plus2,
	Plus4,
};

export type DrawInfo = {
	type: DrawType.None,
} | {
	type: DrawType.Plus2 | DrawType.Plus4,
	count: number,
};

export enum DrawCardMethod {
	GrabBag = 'GrabBag',
	Random = 'Random',
};

export const drawCardMethods = Object.freeze([
	DrawCardMethod.GrabBag,
	DrawCardMethod.Random,
]);

export enum Direction {
	Forward,
	Backward,
};

export type GameData = {
	state: State,
	yourTurn: boolean,
	hand: Card[],
	playableHand: boolean[]
	isAdmin: boolean,
	topCards: PlayedCard[],
	turnPlayerName: string,
	otherPlayers: OtherPlayerData[],
	winner?: string,
	adminProps?: AdminProps,
	direction: Direction,
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
	gameData: GameData,
};

export type ServerData = NameValidation | MessageBroadcast | GameUpdate;

// sent by client side
export enum ClientType {
	Name,
	Message,
	PlayCard,
	DrawCard,
	RestartGame,
	AdminUpdates,
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

export type RestartGame = {
	type: ClientType.RestartGame,
};

export type AdminProps = {
	stacking: boolean,
	startingHandSize: number,
	disableChat: boolean,
	twoPlayerReverseSkip: boolean, // Whether or not a reverse should skip someones turn when there are only 2 players
	drawCardMethod: DrawCardMethod,
	clearStackOnGameOver: boolean,
};

export type AdminUpdates = {
	type: ClientType.AdminUpdates,
} & AdminProps;

export type ClientData = NameRequest | MessageRequest| PlayCard | DrawCard | RestartGame | AdminUpdates;
