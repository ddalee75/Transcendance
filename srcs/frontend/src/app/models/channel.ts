import { User } from './user'
import { Message } from './message'

export interface 	Channel {
    id?: 			number;
    name:			string;
    creator:		User;
	creator_id:		number;
	messages:		Message[];
    password?:      string;
    joined?:        User[];
    muted?:         User[];
    admins?:        User[];
    banned?:        User[];
}