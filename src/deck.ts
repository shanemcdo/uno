import { DrawInfo, DrawType } from "./types";

export enum Color {
	Red = 'Red',
	Yellow = 'Yellow',
	Blue = 'Blue',
	Green = 'Green',
}

const colors = Object.freeze([
	Color.Red,
	Color.Yellow,
	Color.Blue,
	Color.Green,
]);

export enum CardType {
	Number = 'Number',
	Action = 'Action',
	Wild = 'Wild',
}

export enum ActionType {
	Draw2 = 'Draw2',
	Reverse = 'Reverse',
	Skip = 'Skip',
}

const actionTypes = Object.freeze([
	ActionType.Draw2,
	ActionType.Reverse,
	ActionType.Skip,
]);

export enum WildType {
	Wild = 'Wild',
	WildDraw4 = 'WildDraw4',
};

const wildTypes = Object.freeze([
	WildType.Wild,
	WildType.WildDraw4,
]);

export type NumberCard = {
	color: Color,
	type: CardType.Number,
	number: number,
};

export type ActionCard = {
	color: Color,
	type: CardType.Action,
	action: ActionType,
};

export type WildCard = {
	type: CardType.Wild,
	wildType: WildType,
};

export type PlayedWildCard = {
	color: Color,
} & WildCard;

export type Card = NumberCard | ActionCard | WildCard;
export type PlayedCard = NumberCard | ActionCard | PlayedWildCard;

export const deck = (() => {
	// https://www.letsplayuno.com/news/guide/20181213/30092_732567.html
	const result: Card[] = [];
	for(const color of colors) {
		// 1 '0' per color
		result.push({
			color,
			type: CardType.Number,
			number: 0
		});
		// 2 of each number 1-9 per color
		for(let i = 1; i <= 9; i++) {
			for(let j = 0; j < 2; j++) {
				result.push({
					color,
					type: CardType.Number,
					number: i
				});
			}
		}
		// 2 of each action per color
		for(const action of actionTypes) {
			for(let j = 0; j < 2; j++) {
				result.push({
					color,
					type: CardType.Action,
					action,
				});
			}
		}
	}
	// 4 of each wild
	for(const wildType of wildTypes) {
		for(let j = 0; j < 4; j++) {
			result.push({
				type: CardType.Wild,
				wildType,
			});
		}
	}
	return Object.freeze(result);
})();

export function canPlayCard(top: PlayedCard, newCard: Card, drawInfo: DrawInfo, stacking: boolean): boolean {
	return (
		drawInfo.type == DrawType.None || (
			stacking && (
				(
					newCard.type === CardType.Action &&
					newCard.action === ActionType.Draw2 &&
					drawInfo.type === DrawType.Plus2
				) || (
					newCard.type === CardType.Wild &&
					newCard.wildType === WildType.WildDraw4 && (
						drawInfo.type === DrawType.Plus2 ||
						drawInfo.type === DrawType.Plus4
					)
				)
			)
		)
	) && (
		// Wild on anything
		newCard.type === CardType.Wild ||
		// colors match
		top.color === newCard.color || (
			// numbers match
			newCard.type === CardType.Number &&
			top.type === CardType.Number &&
			newCard.number === top.number 
		) || (
			// actions match
			newCard.type === CardType.Action &&
			top.type === CardType.Action &&
			newCard.action === top.action
		)
	);
};
