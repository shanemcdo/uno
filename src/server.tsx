import type { DataConnection } from 'peerjs';

import { Peer } from 'peerjs';

const connections: DataConnection[]  = [];

export function createServer(callback: (id: string) => void): Peer {
	const peer = new Peer();
	peer.on('open', callback);
	peer.on('error', err => console.log(err.message));
	peer.on('close', () => console.log('server close'));
	peer.on('connection', conn => {
		conn.on('open', () => {
			connections.push(conn);
			console.log(connections);
			console.log(conn.peer + ' open');
		})
		conn.on('data', data => {
			console.log(data);
			console.log(connections);
		})
		conn.on('close', () => {
			for (let i = 0; i < connections.length;) {
				if(connections[i].peer === conn.peer) {
					connections.splice(i, 1);
				} else {
					i++;
				}
			}
			console.log(conn.peer + ' close');
			console.log(connections);
		})
		conn.on('error', err => console.log(err.message));
	});

	return peer;
};
