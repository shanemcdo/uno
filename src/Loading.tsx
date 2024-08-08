import type { Component } from 'solid-js';

import styles from './App.module.css';

const Loading: Component = () => <div class={styles.loading}>
	<h1>Loading...</h1>
</div>;

export default Loading;
