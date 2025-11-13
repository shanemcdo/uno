export enum Color {
	Red,
	Yellow,
	Blue,
	Green,
}

const colors = Object.freeze([
	Color.Red,
	Color.Yellow,
	Color.Blue,
	Color.Green,
]);

export enum CardType {
	Number,
	Action,
	Wild,
}

export enum ActionType {
	Draw2,
	Reverse,
	Skip,
}

const actionTypes = Object.freeze([
	ActionType.Draw2,
	ActionType.Reverse,
	ActionType.Skip,
]);

export enum WildType {
	Wild,
	WildDraw4,
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

export function canPlayCard(top: PlayedCard, newCard: Card): boolean {
	// Wild on anything
	return newCard.type === CardType.Wild ||
		(
			// number on matching number/color
			newCard.type === CardType.Number &&
			top.type === CardType.Number &&
			(newCard.number === top.number || newCard.color === top.color)
		) ||
		(
			// action on matching action/color
			newCard.type === CardType.Action &&
			top.type === CardType.Action &&
			(newCard.action === top.action || newCard.color === top.color)
		) ||
		(
			// number/action on matching color from wild
			top.type === CardType.Wild &&
			top.color === newCard.color
		);
};
