import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

type GameProps = {
	conn: DataConnection,
};

const Game: Component<GameProps> = props => {
	const url = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('id', props.conn.peer);
		return url.href;
		
	};
	return <>
		{props.conn.peer}
		<input
			type="button"
			value="Click me"
			onclick={() => {
				props.conn.send('test!');
			}}
		/>
		<a
			href={url()}
			target="_blank"
		>Sharable Link</a>
	</>;
};

export default Game;
