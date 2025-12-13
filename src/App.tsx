import type { Component } from 'solid-js';
import type { DataConnection } from 'peerjs'

import { Peer } from 'peerjs';
import { createSignal, Show } from 'solid-js';
import { createServer } from './server';
import Loading from './Loading';
import Game from './Game';
import styles from './App.module.scss';
import StringInput from './StringInput';

const peer = new Peer();
const [id, setId] = createSignal<string>('');
const [conn, setConn] = createSignal<DataConnection | null>(null);
const [loading, setLoading] = createSignal(false);
const [connectionError, setConnectionError] = createSignal('');

function connect(id: string) {
	const conn = peer.connect(id, { reliable: true });
	const timeout = setTimeout(() => {
		setConnectionError(`Couldn't connect to ${id}`);
	}, 500);
	conn.on('open', () => {
		console.log('conn connected');
		clearTimeout(timeout);
		setConn(conn);
		setLoading(false);
	});
	conn.on('close', () => {
		console.log('conn close');
		setConn(null);
	});
	conn.on('error', err => console.log(err.message));
}

const Menu = () => {
	return <div class={styles.container}>
		<div class={styles.option}>
			<input
				type="button"
				value="Create Game"
				disabled={id() === ''}
				onclick={() => {
					setLoading(true);
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
			<StringInput
				placeholder="Game Code"
				callback={connect}
				buttonText="Join Game"
				error={connectionError()}
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
	window.addEventListener('onunload', () => {
		if(conn()) {
			conn()!.close();
		}
	});
	return <div class={styles.App}>
		<Show
			when={id() && !loading()}
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
