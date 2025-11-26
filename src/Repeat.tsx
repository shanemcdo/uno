import type { Component, ParentProps } from 'solid-js';

import { For } from 'solid-js';

type Props = ParentProps<{
    count: number,
}>;

const Repeat: Component<Props> = props => {
    const indicies = () => {
        const result = [];
        for(let i = 0; i < props.count; i++ ) {
            result.push(i);
        }
        return result;
    }
	return <For each={indicies()} >{
        () => props.children
    }</For>
};

export default Repeat;
