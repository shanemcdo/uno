import type { Component } from 'solid-js';

import { Peer } from 'peerjs';
import { createSignal, Show } from 'solid-js';
import styles from './Game.module.css';

const Game: Component = () => {
	const peer = new Peer();
	return <div class={styles.game}>
	<h1>Test!</h1>
	</div>;
};

export default Game;
