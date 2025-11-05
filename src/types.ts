export type Message = {
	name: string,
	message: string,
};

// sent by server side
export enum ServerType {
	Name,
	Message,
};

export type NameValidation = {
	type: ServerType.Name,
	accepted: boolean,
	name: string,
};

export type MessageBroadcast = {
	type: ServerType.Message,
	name: string,
	message: string,
};

export type ServerData = NameValidation | MessageBroadcast;

// sent by client side
export enum ClientType {
	Name,
	Message,
};

export type NameRequest = {
	type: ClientType.Name,
	name: string,
};

export type MessageRequest = {
	type: ClientType.Message,
	message: string,
};

export type ClientData = NameRequest | MessageRequest;
