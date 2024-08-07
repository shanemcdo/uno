import type { Component } from 'solid-js';

import { Peer } from 'peerjs';
import { createSignal, Show } from 'solid-js';
import styles from './MainMenu.module.css';

const MainMenu: Component = () => {
	const peer = new Peer();
	const [id, setId] = createSignal<string>('');
	const getUrl = (game_type: string, id: string ) => {
		const url = new URL('game', window.location.href);
		url.searchParams.set('type', game_type);
		url.searchParams.set('id', id);
		return url.href;
	}
	peer.on('open', setId);
	let game_code_input: HTMLInputElement | undefined;
	const [joinButtonDisabled, setJoinButtonDisabled] = createSignal(true);
	return <div class={styles.MainMenu}>
		<input
			type="button"
			value="Create Game"
			disabled={id() === ''}
			onclick={() => {
				window.location.href = getUrl('create', id());
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
				window.location.href = getUrl('join', game_code_input!.value)!;
			}}
		/>
	</div>;
};

export default MainMenu;
