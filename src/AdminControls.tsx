import type { Component } from 'solid-js';

import { createEffect, createSignal } from 'solid-js';
import { AdminProps, drawCardMethods } from './types';
import Popout, { Location } from './Popout';
import { CheckboxControls, DropDownControls, NumberControls } from './controls';

import styles from './AdminControls.module.scss';

type Props = {
	isAdmin: boolean,
	startingProps: AdminProps,
	callback: (adminProps: AdminProps) => void,
};

const AdminControls: Component<Props> = props => {
	const [stacking, setStacking] = createSignal(props.startingProps.stacking);
	const [startingHandSize, setStartingHandSize] = createSignal(props.startingProps.startingHandSize);
	const [disableChat, setDisableChat] = createSignal(props.startingProps.disableChat);
	const [twoPlayerReverseSkip, setTwoPlayerReverseSkip] = createSignal(props.startingProps.twoPlayerReverseSkip);
	const [drawCardMethod, setDrawCardMethod] = createSignal(props.startingProps.drawCardMethod);
	const [clearStackOnGameOver, setClearStackOnGameOver] = createSignal(props.startingProps.clearStackOnGameOver);

	createEffect(() => {
		props.callback({
			stacking: stacking(),
			startingHandSize: startingHandSize(),
			disableChat: disableChat(),
			twoPlayerReverseSkip: twoPlayerReverseSkip(),
			drawCardMethod: drawCardMethod(),
			clearStackOnGameOver: clearStackOnGameOver(),
		} as AdminProps)
	})

	return <>
	<Popout location={Location.Right}>
		<h1>Admin {props.isAdmin
			? 'Controls'
			: 'Rules'}</h1>
		<div class={styles.grid}>
			<CheckboxControls
				label="Stacking"
				accessor={() => props.startingProps.stacking}
				setter={setStacking}
				disabled={!props.isAdmin}
			/>
			<NumberControls
				label="Starting Hand Size"
				accessor={() => props.startingProps.startingHandSize}
				setter={setStartingHandSize}
				disabled={!props.isAdmin}
			/>
			<CheckboxControls
				label="Disable Chat"
				accessor={() => props.startingProps.disableChat}
				setter={setDisableChat}
				disabled={!props.isAdmin}
			/>
			<CheckboxControls
				label="Two Player Reverse Skip"
				accessor={() => props.startingProps.twoPlayerReverseSkip}
				setter={setTwoPlayerReverseSkip}
				disabled={!props.isAdmin}
			/>
			<DropDownControls
				label="Draw Card Method"
				accessor={() => props.startingProps.drawCardMethod}
				setter={setDrawCardMethod}
				choices={drawCardMethods}
				disabled={!props.isAdmin}
			/>
			<CheckboxControls
				label="Clear Stack on Game Over"
				accessor={() => props.startingProps.clearStackOnGameOver}
				setter={setClearStackOnGameOver}
				disabled={!props.isAdmin}
			/>
		</div>
	</Popout>
	</>
};

export default AdminControls;
