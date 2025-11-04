import type { DataConnection } from 'peerjs';

import { Peer } from 'peerjs';

type NameData = {
	type: 'name',
	name: string,
};

type MessageData = {
	type: 'message',
	message: string,
};

type Data = NameData | MessageData;

type PlayerData = {
	conn: DataConnection
	name: string,
};

const playerData: Record<string, PlayerData> = {};

function nameExists(name: string): boolean {
	for(const player of Object.values(playerData)) {
		if(player.name === name) return true;
	}
	return false;
}

export function createServer(callback: (id: string) => void): Peer {
	const peer = new Peer();
	peer.on('open', callback);
	peer.on('error', err => console.log(err.message));
	peer.on('close', () => console.log('server close'));
	peer.on('connection', conn => {
		conn.on('open', () => {
			console.log(conn.peer + ' open');
		})
		conn.on('data', data => {
			console.log(data);
			const d = data as Data;
			switch(d.type) {
			case 'name':
				const accepted = !nameExists(d.name);
				if(accepted) {
					playerData[conn.peer] = {
						conn,
						name: d.name,
					};
				}
				conn.send({
					type: 'name',
					name: d.name,
					accepted,
				});
				break;
			case 'message':
				for(const player of Object.values(playerData)) {
					player.conn.send({
						type: 'message',
						message: d.message,
						name: playerData[conn.peer].name,
					});
				}
				break;
			}
		})
		conn.on('close', () => {
			console.log(playerData);
			delete playerData[conn.peer];
			console.log(playerData);
			console.log(conn.peer + ' close');
		})
		conn.on('error', err => console.log(err.message));
	});

	return peer;
};
