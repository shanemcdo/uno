import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

type GameProps = {
	conn: DataConnection,
};

const Game: Component<GameProps> = props => {
	return <>
		{props.conn.peer}
		<input
			type="button"
			value="Click me"
			onclick={() => {
				props.conn.send('test!');
			}}
		/>
	</>;
};

export default Game;
