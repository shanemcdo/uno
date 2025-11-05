import type { Component } from 'solid-js';
import type { Card } from './deck';

import { For } from 'solid-js';
import CardComponent from './CardComponent';

type Props = {
	hand: Card[]
}

const Hand: Component<Props> = props => {
	return <div>
		<For each={props.hand}>{ card =>
			<CardComponent card={card} />
		}</For>
	</div>
	
};

export default Hand;
