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
	window.addEventListener('beforeunload', () => {
		props.conn.close();
	});
	return <>
		{props.conn.peer}
		<input
			type="button"
			value="Click me"
			onclick={() => {
				props.conn.send('test!');
			}}
		/>
		<input
			type="button"
			value="Close"
			onclick={() => {
				props.conn.close();
			}}
		/>
		<a
			href={url()}
			target="_blank"
		>Sharable Link</a>
	</>;
};

export default Game;
