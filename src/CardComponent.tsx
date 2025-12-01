import type { Component } from 'solid-js';
import type { ActionCard, Card, NumberCard, PlayedCard, PlayedWildCard } from './deck';

import { ActionType, CardType } from './deck';
import { Switch, Match, mergeProps, Show } from 'solid-js';
import { OcCircleslash2 } from 'solid-icons/oc';
import { FiRefreshCcw } from 'solid-icons/fi';
import { TbCards } from 'solid-icons/tb';

import styles from './CardComponent.module.scss';


type Props = {
	card: Partial<PlayedCard> & Card
	onclick?: () => void,
	disabled: boolean,
}

const FaceUpCard: Component<Props> = props => {
	const ActionIcon = () => {
		if(props.card.type !== CardType.Action) {
			return null;
		}
		switch(props.card.action) {
		case ActionType.Draw2:
			return <TbCards />;
		case ActionType.Reverse:
			return <FiRefreshCcw />;
		case ActionType.Skip:
			return <OcCircleslash2 />;
		}
	}

	return <div classList={{
		[styles.card]: true,
		[styles.clickable]: props.onclick !== undefined && !props.disabled,
		[styles.disabled]: props.disabled,
	}} onclick={props.onclick} data-color={props.card.color} >
		<Switch>
			<Match when={props.card.type === CardType.Number}>
				<div class={styles.number_oval}>
					<span>{(props.card as NumberCard).number}</span>
				</div>
			</Match>
			<Match when={props.card.type === CardType.Action}>
				<div class={styles.number_oval}>
					<span><ActionIcon /></span>
				</div>
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
