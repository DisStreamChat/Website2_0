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
	role: false;
	type: string;
}

export interface commandMap {
	[key: string]: command;
}