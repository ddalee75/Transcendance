import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete,
	ConsoleLogger,
	Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TechService } from './tech.service';
import { MessageService } from './message.service';
import { ChannelService } from './channel.service';
import { OauthService } from './oauth.service';
import { TfaService } from './tfa.service';
import {
	User as UserModel, Tech as TechModel,
	Oauth as OauthModel,
	Tfa as TfaModel,
	Message as MessageModel,
	Channel as ChannelModel,
	Prisma, PrismaClient
} from '@prisma/client';
import { lstat } from 'fs';

@Controller()
export class AppController {
	constructor(
		private readonly messageService: MessageService,
		private readonly userService: UserService,
		private readonly techService: TechService,
		private readonly oauthService: OauthService,
		private readonly channelService: ChannelService,
		private readonly tfaService: TfaService
	) { }

	// @Post('joinChannel')
	// async joinChannel(@Body() data : {target: ChannelModel, user: UserModel})
	// {
	// 	console.log("App Controller : channel name : " + data.target.name + " | user name : " + data.user.login);
	// 	return await this.channelService.joinChannel(data);
	// }

	@Post('addChannel')
	async addChannel(@Body() ChannelData: {name: string, creator_id: number},): Promise<ChannelModel>
	{
		return await this.channelService.addChannel(ChannelData);
	}

	@Post('addPrivateChannel')
	async addPrivateChannel(@Body() ChannelData: {name: string, creator_id: number, password: string},): Promise<ChannelModel>
	{
		return await this.channelService.addChannel(ChannelData);
	}

	@Post('updateNickName')
	async updateNickName(@Body() UserData:{id:number, nickname:string},): Promise<UserModel>
	{
		return await this.userService.updateNickName(UserData);
	}

	@Post('updateAvatar')
	async updateAvatar(@Body() UserData:{id:number, avatar:string},): Promise<UserModel>
	{
		return await this.userService.updateAvatar(UserData);
	}

	@Get('getAllChannels')
	async getAllChannels() : Promise<ChannelModel[]>
	{
		return await this.channelService.getAllChannels();
	}

	@Get('findChannelByName/:name')
	async findChannelByName(@Param('name') name: string): Promise<ChannelModel>
	{
		return await this.channelService.findChannelByName(name);
	}

	@Get('userByLogin/:login')
	async getUserByLogin(@Param('login') login: string)
	{
		return await this.userService.findUserByLogin(login);
	}

	// @Post('updateNickName/:')

	@Post('message')
	async addMessage(
		@Body() messageData: { userId: number, fromUserName: string, fromUserId: number, content: string },
	): Promise<MessageModel> {
		return await this.messageService.createMessage(messageData);
	}

	@Post('channelMessage')
	async channelMessage(
		@Body() messageData: {channel_name: string, fromUserName: string, fromUserId: number, content: string}) : Promise<MessageModel> {
		return await this.messageService.createChannelMessage(messageData);
	}
	
	@Get('getSocket/:login')
	async getSocket(@Param('login') login: string) : Promise<UserModel> {
		return await this.userService.findUserByLogin(login);
	}

	@Get('checkIfFriend/:data')
	async checkIfFriend(@Param('data') id: {id: number, id1: number} ) : Promise<number>
	{
//		return await this.userService.checkIfFriend(id);
		return 1;
	}

	@Get('messages/:fromUserId/:userId')
	async getMessages(
		@Param('fromUserId') fromUserId: Number, @Param('userId') userId: Number
		): Promise<MessageModel[]> {
			let data  = {fromUserId, userId};
			return await this.messageService.getMessages(data);
		}
	
	@Get('channelMessages/:channelName')
	async getChannelMessages(
		@Param('channelName') channelName: string
	): Promise<MessageModel[]> {
		let data = {channelName};
		return await this.messageService.getChannelMessages(data);
	}

	@Get('users/:code')
	async getUsers(@Param('code') code: string): Promise<UserModel[]> {
		let data = code;
		return await this.userService.getAllUsers(data);
	}

	@Patch('user/:code')
	async patchUser(@Param('code') code: string,
		@Body() userData: { online?: boolean, two_factor_auth?: boolean }): Promise<UserModel> {
		return this.userService.updateUser({
			where: { code },
			data: userData
		});
	}

	@Get('user/:code')
	async getUser(
		@Param('code') code: string) {
		this.userService.user(code);
	}

	@Get('user/info/:code')
	async getUserInfo(
		@Param('code') code: string): Promise<boolean> {
			try {
				const tmp = await this.oauthService.oauth({code});
				const result = await this.userService.userInfo(tmp);
				return (result);
			}
			catch {
				return false;
			}
			
		}

	@Post('auth/')
	async signup(
		@Body() auth: { code: string }): Promise<UserModel | boolean> {
		try {
			var oauth = await this.oauthService.getToken(auth.code);
			if (oauth != null)
				return await this.userService.createUser(oauth, auth.code);
			else
				throw Prisma.PrismaClientKnownRequestError
		} catch (e) {
		}
	}

	@Patch('tfa/disable')
	async patchTfa(
		@Body() params: {code: string}) {
		this.tfaService.disableTfa(params.code);
	}

	@Post('tfa/signup')
	async postSignup(
		@Body() params :{code: string}): Promise<TfaModel> {
		return (this.tfaService.createTfa(params.code));
	}

	@Post('tfa/verify')
	async postVerify(
		@Body() param: { code: string, tfa_key: string }) {
		return (await this.tfaService.verifyTfa(param))
	}

	@Post('tfa/validate')
	async postValidate(
		@Body() param: { code: string, tfa_key: string }): Promise<UserModel | boolean> {
		return (await this.tfaService.validateTfa(param));
	}

	// @Post('upload/')
	// async uploadAvatar(
	// 	@Body() param: {name: Blob}
	// ) {
		
	// 	const fs = require('fs');
	// 	let filePath= './upload/${Date.now()_$test}';
	// 	console.log("nom:" + param.name);
	// 	// let buffer=Buffer.from(param.name.split(',')[1],"base64");
	// 	// console.log("hello" + buffer);
	// 	fs.writeFiles(filePath, param.name);
		



		// }
}
