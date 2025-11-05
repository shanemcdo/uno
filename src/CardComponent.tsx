import type { Component } from 'solid-js';
import type { ActionCard, Card, NumberCard, WildCard } from './deck';

import { CardType } from './deck';
import { Switch, Match } from 'solid-js';


type Props = {
	card: Card
}

const CardComponent: Component<Props> = props => {
	return <p>
		<Switch>
			<Match when={props.card.type === CardType.Number}>
				Number: {(props.card as NumberCard).color} {(props.card as NumberCard).number}
			</Match>
			<Match when={props.card.type === CardType.Action}>
				Action: {(props.card as ActionCard).color} {(props.card as ActionCard).action}
			</Match>
			<Match when={props.card.type === CardType.Wild}>
				Wild: {(props.card as WildCard).wildType}
			</Match>
		</Switch>
	</p>
	
};

export default CardComponent;
