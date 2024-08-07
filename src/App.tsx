import type { Component } from 'solid-js';

import { Peer } from 'peerjs';
import { createSignal, Show } from 'solid-js';
import styles from './App.module.css';

const App: Component = () => {
	const peer = new Peer();
	const [id, setId] = createSignal<string>('');
	const createGameUrl = () => {
		if(id() === '') {
			return null;
		}
		const url = new URL('game.html', window.location.href);
		url.searchParams.set('type', 'create');
		url.searchParams.set('id', id());
		return url.href;
	}
	peer.on('open', setId);
	return <div class={styles.App}>
		<a
			href={createGameUrl()}
		>Create Game</a>
	</div>;
};

export default App;
