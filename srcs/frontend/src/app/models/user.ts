import { Channel } from '../models/channel'
import { Oauth } from './oauth';

export interface 	User {
    id: 			number;
	email:			string;
	login:			string;
	first_name:		string;
	last_name:		string;
	url:			string;
	displayname:	string;
	nickname:		string;
	image:			string;
	avatar:			string;
	online:			boolean;
	channel_joined?:Channel[];
	muted?:			Channel[];
	banned?:		Channel[];
	admin_of?:		Channel[];
	oauth_id?:		number;
	oauth?:			Oauth;
	socket?:		string;
	friends?:		User[];
	blocked?:		User[];
	blockedby?:		User[];
	
}
