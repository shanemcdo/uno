import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

import { Peer } from 'peerjs';
import { createSignal, Show } from 'solid-js';
import { createServer } from './server';
import styles from './App.module.css';

const peer = new Peer();
const [id, setId] = createSignal<string>('');
const [conn, setConn] = createSignal<DataConnection | null>(null);

function connect(id: string) {
	const conn = peer.connect(id, { reliable: true });
	conn.on('open', () => {
		console.log('conn connected');
		setConn(conn);
	});
	conn.on('close', () => {
		console.log('conn close');
		setConn(null);
	});
	conn.on('error', err => console.log(err.message));
}

const Menu = () => {
	let game_code_input: HTMLInputElement | undefined;
	const [joinButtonDisabled, setJoinButtonDisabled] = createSignal(true);
	return <>
		<input
			type="button"
			value="Create Game"
			disabled={id() === ''}
			onclick={() => {
				createServer(connect);
			}}
		/>
		OR
		<input
			placeholder="Game Code"
			ref={game_code_input}
			oninput={ e => setJoinButtonDisabled(e.target.value === '') }
		/>;
		<input
			type="button"
			value="Join Game"
			disabled={joinButtonDisabled()}
			onclick={() => {
				connect(game_code_input!.value);
			}}
		/>
	</>;
};

const Game = () => {
	return <>
		{conn()!.peer}
		<input
			type="button"
			value="Click me"
			onclick={() => {
				conn()!.send('test!');
			}}
		/>
	</>;
};

const App: Component = () => {
	peer.on('open', setId);
	return <div class={styles.App}>
		<Show
			when={conn() === null}
			fallback={<Game/>}
		> <Menu /> </Show>
	</div>;
};

export default App;
