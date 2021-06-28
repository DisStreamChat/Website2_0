import { EmbedOptions } from "../components/dashboard/Discord/EmbedEditor";

export interface role {
	id: string,
	name: string,
	color: string,
	rawPosition: number,
	position: number,
	permissions: number,
	managed?: boolean
}

export interface guildMember {

}

export interface channel {
	id: string,
	name: string,
	parent?: string
}	

export interface server {

}

export interface command {
	DM?: boolean;
	allowedChannels: string[];
	bannedRoles: string[];
	cooldown: number;
	cooldownTime: number;
	deleteUsage?: boolean;
	description: string;
	lastUsed: number;
	message: string;
	name: string;
	permittedRoles: string[];
	roles?: role[];
	type: string;
	embedMessage: boolean;
	embedMessageData: EmbedOptions;
}

export interface commandMap {
	[key: string]: command;
}

export interface Action {
	server?: string;
	type: string;
	value?: any;
	key?: string;
}