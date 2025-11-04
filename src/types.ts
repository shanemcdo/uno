export type Message = {
	name: string,
	message: string,
};

// set by server side
export type MessageBroadcast = {
	type: 'message',
	name: string,
	message: string,
};

export type NameValidation = {
	type: 'name',
	accepted: boolean,
	name: string,
};

export type ServerData = MessageBroadcast | NameValidation;

// sent by client side

export type NameRequest = {
	type: 'name',
	name: string,
};

export type MessageRequest = {
	type: 'message',
	message: string,
};

export type ClientData = NameRequest | MessageRequest;
