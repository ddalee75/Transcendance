import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service';

@Injectable()
export class BanAndMuteService {

	private _delay: number = 0;

	constructor(private prisma : PrismaService) {}

	setupDelay(delay: number)
	{
		this._delay = delay;
	}

	sleep(ms:number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async test(){
		await this.sleep(this._delay * 1000);
	}

	/* 
	MUTE
	*/

	async muteUserDuringDelay(userToMute: number, channelToMute: number, time: number)
	{
		let data = await this.muteUserFromChannel(userToMute, channelToMute);
		if (data != null && data != undefined)
		{
			await this.sleep(time * 1000);
			data = null;
			data = await this.unmuteUserFromChannel(userToMute, channelToMute)
			if (data != null && data != undefined)
				return data
		}
	}


	async muteUserFromChannel(userToMute: number, channelToMute: number)
	{
		try{
			let data = await this.prisma.channel.update({
				where: {
					id: channelToMute
				},
				data: {
					muted: {
						connect: [{id: Number(userToMute)}],
					}
				},
				include: {
					joined: true,
					muted: true,
					banned: true,
					admins: true
				}
			})
			if (data != null && data != undefined)
				return data
			}
		catch(err)
		{
			console.log("error dans muteUserFromChannel :");
			console.log(err);
		}
	}

	async unmuteUserFromChannel(userToMute: number, channelToMute: number)
	{
		try{
			let data = await this.prisma.channel.update({
				where: {
					id: channelToMute
				},
				data: {
					muted: {
						disconnect: [{id: Number(userToMute)}],
					}
				},
				include: {
					joined: true,
					muted: true,
					banned: true,
					admins: true
				}
			})
			if (data != null && data != undefined)
				return data
		}
		catch(err)
		{
			console.log("error dans unmuteUserFromChannel :");
			console.log(err);
		}
	}

	/*
	BAN
	*/

	async banUserDuringDelay(userToBan: number, channelToBan: number, time: number)
	{
		this.muteUserFromChannel(userToBan, channelToBan);
		await this.sleep(time * 1000);
		this.unmuteUserFromChannel(userToBan, channelToBan)
	}


	async banUserFromChannel(userToBan: number, channelToBan: number)
	{
		try{
			let data = await this.prisma.channel.update({
				where: {
					id: channelToBan
				},
				data: {
					banned: {
						connect: [{id: Number(userToBan)}],
					},
					joined: {
						disconnect: [{id: Number(userToBan)}],
					}
				},
				include: {
					joined: true,
					muted: true,
					banned: true,
					admins: true
				}
			})
			if (data != null && data != undefined)
			{
				return data
			}
		}
		catch(err){
			console.log("error dans banUserFromChannel :");
			console.log(err);
		}
	}

	async unbanUserFromChannel(userToBan: number, channelToBan: number)
	{
		try{
			let data = await this.prisma.channel.update({
				where: {
					id: channelToBan
				},
				data: {
					banned: {
						disconnect: [{id: Number(userToBan)}],
					}
				},
				include: {
					joined: true,
					muted: true,
					banned: true,
					admins: true
				}
			})
			if (data != null && data != undefined)
				return data
		}
		catch(err){
			console.log("error dans unbanUserFromChannel :");
			console.log(err);
		}
	}
}
