import type { Component } from 'solid-js';
import type { ActionCard, Card, NumberCard, PlayedCard, PlayedWildCard } from './deck';

import { ActionType, CardType, WildType } from './deck';
import { Switch, Match, mergeProps, Show } from 'solid-js';
import { OcCircleslash2 } from 'solid-icons/oc';
import { FiRefreshCcw } from 'solid-icons/fi';
import { TbCards } from 'solid-icons/tb';

import styles from './CardComponent.module.scss';

type Props = {
	card?: Partial<PlayedCard> & Card
	onclick?: () => void,
	disabled?: boolean,
}

const CardComponent: Component<Props> = p => {
	const props = mergeProps({ disabled: false }, p);

	const ActionIcon = () => {
		if(props.card === undefined || props.card.type !== CardType.Action) {
			return null;
		}
		switch(props.card.action) {
		case ActionType.Draw2: return <TbCards />;
		case ActionType.Reverse: return <FiRefreshCcw />;
		case ActionType.Skip: return <OcCircleslash2 />;
		}
	}

	const CenterIcon = () => {
		if(props.card === undefined) return 'UNO';
		switch(props.card.type) {
		case CardType.Number: return props.card.number;
		case CardType.Action: return <ActionIcon />;
		case CardType.Wild:
			if(props.card.wildType === WildType.WildDraw4) {
				return '+4';
			}
			break;
		}
		return null;
	}

	const card_type_class = () => {
		if(props.card === undefined) return styles.logo;
		switch(props.card.type) {
		case CardType.Number: return styles.number_card;
		case CardType.Action: return styles.action_card;
		case CardType.Wild: return styles.wild_card;
		}
	}

	const Corner = () => {
		const child = (
				props.card
				&& props.card.type === CardType.Action
				&& props.card.action === ActionType.Draw2
			)
			? '+2'
			: <CenterIcon />;
		return <Show when={child}>
			<span class={`${styles.corner} ${card_type_class()}`}>{child}</span>
		</Show>;
	}

	return <div classList={{
		[styles.card]: true,
		[styles.clickable]: props.onclick !== undefined && !props.disabled,
		[styles.disabled]: props.disabled,
	}} onclick={props.onclick} data-color={props.card?.color ?? ''}>
		<Corner />
		<Corner />
		<div class={`${styles.oval} ${card_type_class()}`}>
			<span><CenterIcon /></span>
		</div>
	</div>;

};

export default CardComponent;
