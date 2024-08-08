import type { Component } from 'solid-js';

import { Peer } from 'peerjs';
import { createSignal } from 'solid-js';
import styles from './App.module.css';

const [id, setId] = createSignal<string>('');

const Menu = () => {
	let game_code_input: HTMLInputElement | undefined;
	const [joinButtonDisabled, setJoinButtonDisabled] = createSignal(true);
	return <>
		<input
			type="button"
			value="Create Game"
			disabled={id() === ''}
			onclick={() => {
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
			}}
		/>
	</>;
};

const App: Component = () => {
	const peer = new Peer();
	peer.on('open', setId);
	return <div class={styles.App}>
		<Menu />;
	</div>;
};

export default App;
