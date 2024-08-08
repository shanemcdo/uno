import { Peer } from 'peerjs';

export function createServer(callback: (id: string) => void): Peer {
	const peer = new Peer();
	peer.on('open', callback);
	peer.on('error', err => console.log(err.message));
	peer.on('close', () => console.log('server close'));
	peer.on('connection', conn => {
		conn.on('data', data => {
			console.log(data);
		})
	});

	return peer;
};
