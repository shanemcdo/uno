import type { Component } from 'solid-js';
import type { ActionCard, Card, NumberCard, PlayedCard, PlayedWildCard } from './deck';

import { CardType } from './deck';
import { Switch, Match, mergeProps, Show } from 'solid-js';


type Props = {
	card: Partial<PlayedCard> & Card
	onclick?: () => void,
}

const CardComponent: Component<Props> = p => {
	const props = mergeProps({ onclick: () => {} }, p);
	return <p onclick={props.onclick}>
		<Switch>
			<Match when={props.card.type === CardType.Number}>
				Number: {(props.card as NumberCard).color} {(props.card as NumberCard).number} 
			</Match>
			<Match when={props.card.type === CardType.Action}>
				Action: {(props.card as ActionCard).color} {(props.card as ActionCard).action}
			</Match>
			<Match when={props.card.type === CardType.Wild}>
				Wild: 
				<Show when={props.card.color !== undefined}>
					{props.card.color}
					{' '}
				</Show>
				{(props.card as PlayedWildCard).wildType}
			</Match>
		</Switch>
	</p>
	
};

export default CardComponent;
