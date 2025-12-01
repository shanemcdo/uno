import type { Component } from 'solid-js';
import type { ActionCard, Card, NumberCard, PlayedCard, PlayedWildCard } from './deck';

import { CardType } from './deck';
import { Switch, Match, mergeProps, Show } from 'solid-js';

import styles from './CardComponent.module.scss'


type Props = {
	card: Partial<PlayedCard> & Card
	onclick?: () => void,
	disabled: boolean,
}

const FaceUpCard: Component<Props> = props => {
	return <div classList={{
		[styles.card]: true,
		[styles.clickable]: props.onclick !== undefined && !props.disabled,
		[styles.disabled]: props.disabled,
	}} onclick={props.onclick} data-color={props.card.color} >
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
	</div>
};

const FaceDownCard: Component = () => <div class={styles.card}>
	<div class={styles.logo}>
		<span>UNO</span>
	</div>
</div>;

const CardComponent: Component<Partial<Props>> = p => {
	const props = mergeProps({ disabled: false }, p);
	return <Show
		when={props.card !== undefined}
		fallback={<FaceDownCard />}
	>
		<FaceUpCard
			card={props.card!}
			disabled={props.disabled}
			onclick={props.onclick}
		/>
	</Show>
};

export default CardComponent;
