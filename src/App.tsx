import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

import { Peer } from 'peerjs';
import { createSignal, Show, Suspense } from 'solid-js';
import { createServer } from './server';
import Loading from './Loading';
import Game from './Game';
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
	return <div class={styles.container}>
		<div class={styles.option}>
			<input
				type="button"
				class={styles.button}
				value="Create Game"
				disabled={id() === ''}
				onclick={() => {
					createServer(connect);
				}}
			/>
		</div>
		<div class={styles.divider} >
			<div class={styles.vert_bar} />
			OR
			<div class={styles.vert_bar} />
		</div>
		<div class={styles.option}>
			<input
				placeholder="Game Code"
				ref={game_code_input}
				oninput={ e => setJoinButtonDisabled(e.target.value === '') }
			/>
			<br />
			<input
				type="button"
				class={styles.button}
				value="Join Game"
				disabled={joinButtonDisabled()}
				onclick={() => {
					connect(game_code_input!.value);
				}}
			/>
		</div>
	</div>;
};


const App: Component = () => {
	peer.on('open', id => {
		setId(id);
		const gameId = new URL(window.location.href).searchParams.get('id');
		if(gameId !== null) {
			connect(gameId);
		}
	});
	return <div class={styles.App}>
		<Show
			when={id()}
			fallback={<Loading />}
		>
			<Show
				when={conn() === null}
				fallback={<Game conn={conn()!}/>}
			> <Menu /> </Show>
		</Show>
	</div>;
};

export default App;
