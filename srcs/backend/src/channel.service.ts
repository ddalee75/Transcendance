import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from './prisma.service';
import { Channel } from '@prisma/client';
import { UserService } from './user.service';

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService,
				private httpClient: HttpService,
				private userService: UserService) { }

		
	INTRA_API = "https://api.intra.42.fr";

	async	addChannel(params : {name: string, creator_id: number}): Promise<Channel>
	{
		try{
			await this.prisma.channel.create({
				data: params,
			})
			return await this.prisma.channel.update({
				where: {
					name: params.name,
				},
				data: {
					joined: {
						connect: [{id: params.creator_id}],
					}
				},
			})
		}
		catch(err)
		{
			console.log("error dans addChannel service :");
			console.log(err);
		}
	}

	async	findChannelByName(params: string) : Promise<Channel>
	{
		try{
			return await this.prisma.channel.findFirst({
				where: {
					name: params
				},
				include: {
					joined: true,
					muted: true,
					admins: true,
					messages: true,
					creator: true
				}
			});
		}
		catch(err)
		{
			console.log("error dans findChannelByName service :");
			console.log(err);
		}
	}


	async getAllChannels() : Promise<Channel[]>
	{
	  return await this.prisma.channel.findMany();
	}

}

