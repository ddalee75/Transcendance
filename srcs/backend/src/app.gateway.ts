import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from './prisma.service';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';
import { log } from 'console';

@WebSocketGateway({
  cors: {
    origin: 'https://' + process.env.IP_HOST,
    credential:true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private Prisma : PrismaService, private readonly userService: UserService,){}

  sleep(ms:number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  createRoomName(login1: string, login2: string): string
  {
    let result: string;

    if (login1 < login2)
      result = login1 + login2;
    else
      result = login2 + login1;
    return result;
  }

  createGameRoomName(login1: string, login2: string): string{
    let result: string;

    if (login1 < login2)
      result = login1 + login2;
    else
      result = login2 + login1;
    result = result + "_game"
    return result;
  }

  @WebSocketServer()
  server!: Server;
  private logger: Logger = new Logger('AppGateway');

  /* LIST ID IN ROOM */
  @SubscribeMessage("userInTotoRoom")
  async listIdInRoom()
  {
    let i = 0;
    await (await this.server.in("toto_channel").allSockets()).forEach((id) => {
      console.log("socket " + i + " : ")
      console.log(id);
      i++;
    })
  
  }
  /* SEARCH USER */

  @SubscribeMessage('SearchForThisUser')
  async searchForThisUser(client: any, payload: any)
  {
    let data = await this.Prisma.user.findFirst({
      where: {
        login: payload,
      },
      include: {
        channel_joined: true,
        banned: true,
        friends: true,
        friendsof: true,
        muted: true,
      }
    })
    if (data != null && data != undefined)
    {
      this.server.to(client.id).emit('hereIsTheUserYouAskedFor', data);
    }
  }

  /* MUTE */

  @SubscribeMessage('muteUserByTime')
  async muteUserByTime(client: any, payload: any)
  {
    try{
			let data = await this.Prisma.channel.update({
				where: {
					id: Number(payload[1])
				},
				data: {
					muted: {
						connect: [{id: Number(payload[0])}],
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
          this.server.emit('channelIsUpdated', data);
          data = null;
          let time_to_sleep = Number(payload[2]) * 1000;
          await this.sleep(time_to_sleep);
          data = await this.Prisma.channel.update({
            where: {
              id: Number(payload[1])
            },
            data: {
              muted: {
                disconnect: [{id: Number(payload[0])}],
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
              this.server.emit('channelIsUpdated', data);
              return data
            }
      }
    }
    catch(err)
		{
		  console.log("error dans muteUserFromChannel :");
			console.log(err);
		}
  }

  @SubscribeMessage('muteUser')
  async muteUser(client: any, payload: any)
  {
    try{
			let data = await this.Prisma.channel.update({
				where: {
					id: Number(payload[1])
				},
				data: {
					muted: {
						connect: [{id: Number(payload[0])}],
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
        this.server.emit('channelIsUpdated', data);
        return data
      }
      }
		catch(err)
		{
			console.log("error dans muteUserFromChannel :");
			console.log(err);
		}
  }
  
  @SubscribeMessage('unmuteUser')
  async unmuteUser(client: any, payload: any)
  {
  try{
    let data = await this.Prisma.channel.update({
      where: {
        id: Number(payload[1])
      },
      data: {
        muted: {
          disconnect: [{id: Number(payload[0])}],
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
        this.server.emit('channelIsUpdated', data);
				return data
      }
  }
  catch(err)
  {
    console.log("error dans unmuteUserFromChannel :");
    console.log(err);
  }
  }

/* BAN */

@SubscribeMessage('banUserByTime')
async banUserByTime(client: any, payload: any)
{
  // let data = await this.BaM.banUserDuringDelay(payload[0], payload[1], payload[2]);
  // if (data != null && data != undefined)
  //   this.server.emit('youAreBanned', payload[0], data);
  try{
    let data = await this.Prisma.channel.update({
      where: {
        id: Number(payload[1])
      },
      data: {
        banned: {
          connect: [{id: Number(payload[0])}],
        },
        joined: {
          disconnect: [{id: Number(payload[0])}],
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
      this.server.emit('youAreBanned', payload[0], data);
      data = null;
      let time_to_sleep = Number(payload[2]) * 1000;
      await this.sleep(time_to_sleep);
      data = await this.Prisma.channel.update({
        where: {
          id: Number(payload[1])
        },
        data: {
          banned: {
            disconnect: [{id: Number(payload[0])}],
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
  }
  catch(err){
    console.log("error dans banUserFromChannel :");
    console.log(err);
  }
}

@SubscribeMessage('banUser')
async banUser(client: any, payload: any)
{
  try{
    let data = await this.Prisma.channel.update({
      where: {
        id: Number(payload[1])
      },
      data: {
        banned: {
          connect: [{id: Number(payload[0])}],
        },
        joined: {
          disconnect: [{id: Number(payload[0])}],
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
      this.server.emit('youAreBanned', payload[0], data);
      return data
    }
  }
  catch(err){
    console.log("error dans banUserFromChannel :");
    console.log(err);
  }
}

@SubscribeMessage('unbanUser')
async unbanUser(client: any, payload: any)
{
  // this.BaM.unbanUserFromChannel(payload[0], payload[1]);
  try{
    let data = await this.Prisma.channel.update({
      where: {
        id: Number(payload[1])
      },
      data: {
        banned: {
          disconnect: [{id: Number(payload[0])}],
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
    console.log("error dans unbanUserFromChannel :");
    console.log(err);
  }
}

  /* Be Admin Del Admin*/
  @SubscribeMessage('beAdminSalon')
  async beAdminSalon(client: any, payload: any)
  {
    try {
      let data = await this.Prisma.channel.update({
      where: {
        id: payload[1]
      },
      data: {
        admins: {
          connect:[{id: Number(payload[0])}]
        }
    },
    include: {
      joined: true,
      muted: true,
      banned: true,
      admins: true,
    }
    })
    if(data != null && data != undefined)
      
      this.server.to(data.name + "_channel").emit('newAdminInChannel', data.admins)
      this.server.to(data.name + "_channel").emit('someoneJoinedTheChannel', data)
      
  }
  catch(err) {
    console.log("error dans isOnline");
    console.log(err)
  }
  }
  

  @SubscribeMessage('delAdminSalon')
  async delAdminSalon(client: any, payload: any)
  {
    try {
      let data = await this.Prisma.channel.update({
      where: {
        id: payload[1]
      },
      data: {
        admins: {
          disconnect:[{id: Number(payload[0])}]
        }
    },
    include: {
      joined: true,
      muted: true,
      banned: true,
      admins: true,
    }
    })
    if(data != null && data != undefined)
     
      this.server.to(data.name + "_channel").emit('newAdminInChannel', data.admins)
      this.server.to(data.name + "_channel").emit('someoneJoinedTheChannel', data)
     
  }
  catch(err) {
    console.log("error dans isOnline");
    console.log(err)
  }
  }

  /* CONNECTION */

  @SubscribeMessage('imConnected')
  async connectionNotification(client:any, payload:any)
  {
      //this.server.emit('userListUpdated');
  }

  @SubscribeMessage('imDisconnected')
  async deconnectionNotification(client:any, payload:any)
  {
    this.server.emit('userListUpdated');
  }

  @SubscribeMessage('isOnline')
  async isOnline(client:any, payload: any)
  {
    try {
      let data = await this.Prisma.user.update({
      where: {
        login: payload,
      },
      data: {
        online: true,
      }
    })
    if(data != null && data != undefined)
      this.server.emit('userListUpdated')
  }
  catch(err) {
    console.log("error dans isOnline");
    console.log(err)
  }
}

  @SubscribeMessage('isOffline')
  async isOffline(client:any, payload: any)
  {
    try {
    let data = await this.Prisma.user.update({
      where: {
        login: payload
      },
      data: {
        online: false
      }
    })
    if (data != null && data != undefined)
      this.server.emit('userListUpdated');
  }
  catch(err)
  {
    console.log("error dans isOffline");
    console.log(err);
  }
}

async handleDisconnect(client: Socket): Promise<void> {
  this.logger.log(`Client disconnected: ${client.id}`);
  try{
    let data = await this.Prisma.user.findFirst({
    where: {
      socket: client.id
    }
    })
    if (data != null && data != undefined)
    {
      this.isOffline(client, data.login);
      this.server.emit('userListUpdated');
    }
  }
  catch(err){
  console.log("error dans handle disconnect : ");
  console.log(err);
}
}

async handleConnection(client: Socket, ...args: any[]) {
  
    this.server.emit('userListUpdated');
    this.logger.log(`Client connected: ${client.id}`);
}

@SubscribeMessage('sendLogin')
async setupLogin(client: Socket, payload: any): Promise<void>
{
  try{
    let data = await this.Prisma.user.update({
    where: {
      login: payload,
    },
    data: {
      socket: client.id,
    },
  });
  if (data != null && data != undefined)
    this.server.emit('userListUpdated');
}
catch(err){
  console.log("erreur dans setuplogin : ");
  console.log(err);
  
}
}

  /* USER LIST ACTUALISATION */

  @SubscribeMessage('updateUser')
  async updateUser(client: any, payload: any)
  {
    try{
      let data = await this.Prisma.user.findFirst({
        where : {
          id: Number(payload.id)
        },
        include : {
          banned: true,
          friends: true,
          blocked: true,
          muted: true,
          blockedby: true,
          friendsof: true
        }
      })
      if (data != null && data != undefined)
        this.server.to(client.id).emit('userUpdated', data);
    }
    catch(err){
      console.log("error in updateUser : ")
      console.log(err);
    }
  }

  @SubscribeMessage('userListPlz')
  async sendUserList(client: any, payload: any)
  {
    try{
    let data = await this.Prisma.user.findMany({
      where: {
        id: {
          not: Number(payload),
        }
      },
      include: {
          friends: true,
          channel_joined: true,
          muted: true,
          admin_of: true,
          banned: true,
          creatorOf: true,
          blocked: true,
          blockedby: true,
      }
    })
    if(data != null && data != undefined)
    {
      this.server.to(client.id).emit('hereIsTheUserList', data);
    }
  }
  catch(err) {
    console.log("error SEND USER LIST : ");
    console.log(err); 
  }
}

  /* MESSAGE */

  @SubscribeMessage('sendMsgTo')
  async sendMsgTo(client: any, payload: any): Promise<void> {
    try{
      payload[1] = (await this.userService.findUserByLogin(payload[3])).socket;
      const roomName = this.createRoomName(payload[2], payload[3]);
      this.server.in(payload[1]).socketsJoin(roomName);
      this.server.in(client.id).socketsJoin(roomName);
      this.server.to(roomName).emit('PrivMsg', {msg: payload[0], channel: roomName, from: payload[4]});
    }
    catch(err){
      console.log("error dans sendMsgTo");
      console.log(err);
    }
  }

  @SubscribeMessage('MsgInChannel')
  async MsgInChannel(client: Socket, payload: any)
  {
    this.server.to(payload[0] + "_channel").emit('msginchannel', {msg: payload[2], channel: payload[0], from: payload[1]});
  }

  @SubscribeMessage('msgToMe')
  handlePrivMsg(client:any, payload: any): void
  {
    this.server.sockets.to(payload).emit('msgToClient', client);
  }

  @SubscribeMessage('ActualisationDest')
  async destActualisation(client: Socket, payload: any)
  {
    this.server.to(client.id).emit('DestActualisation', payload);
  }

  /* CREATE CHANNEL */

  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, payload: any)
  {
    try{
      await this.Prisma.channel.create({
			  data: {
          name: String(payload[0]), 
          creator_id: Number(payload[1]),
          joined: {
            connect: [{id: Number(payload[1])}],
          },
          admins: {
            connect: [{id: Number(payload[1])}],
          }
        },
        include : {
          joined: true,
        }
		  })
      const data = await this.Prisma.channel.findMany({
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        },
      })
      if (data != null && data != undefined)
      {
        this.server.emit('aChannelHasBeenCreated', data);
        this.server.to(client.id).emit('youAreReady');
      }
    }
    catch(err){
      console.log("error dans create Channel :");
      console.log(err);
    }
  }

  @SubscribeMessage('createPrivChannel')
  async createPrivChannel(client: Socket, payload: any)
  {
    try{
      await this.Prisma.channel.create({
			  data: {
          name: String(payload[0]), 
          creator_id: Number(payload[1]),
          password: String(payload[2]),
          joined: {
            connect: [{id: Number(payload[1])}],
          },
          admins: {
            connect: [{id: Number(payload[1])}],
          }
        },
		  })
      const data = await this.Prisma.channel.findMany({
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true
        },
      })
      if (data != null && data != undefined)
      {
        this.server.emit('aChannelHasBeenCreated', data);
        this.server.to(client.id).emit('youAreReady');
      }
    }
    catch(err){
      console.log("error dans create priv chann");
      console.log(err);
    }
  }

  @SubscribeMessage('channelToUpdate')
  async updateChannel(client: Socket, payload: any)
  {
    try{
      const data = await this.Prisma.channel.findFirst({
        where: {
          id: payload,
        },
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        }
      })
      if (data != null && data != undefined)
      {
        this.server.to(data.name + "_channel").emit('channelIsUpdated', data);
      }
    }
    catch(err){
      console.log("error dans updateChannel :");
      console.log(err);
    }
  }

  @SubscribeMessage('channelsToUpdate')
  async updateChannels(client: Socket, payload: any)
  {
    try{
      const data = await this.Prisma.channel.findMany({
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        },
      })
      if (data != null && data != undefined)
      {
        this.server.emit('aChannelHasBeenCreated', data);
        this.server.emit('channelsAreUpdated', data);
        this.server.to(client.id).emit('youAreReady');
      }
    }
    catch(err)
    {
      console.log("error dans updateChannels :");
      console.log(err);
    }
  }

  /* JOIN/LEAVE CHANNEL */

  @SubscribeMessage('verifyPassword')
  async verifyPassword(client: Socket, payload:any)
  {
    let data = await this.Prisma.channel.findFirst({
      where: {
        name: payload[1]
      }
    })
    if (data != null && data != undefined)
    {
      if(data.password == payload[0])
        this.server.to(client.id).emit('goodPassword', true);
      else
        this.server.to(client.id).emit('wrongPassword', false);
    }
  }

  @SubscribeMessage('resetChannelPassword')
  async resetChannelPassword(client: Socket, payload: any)
  {
    try{
    let data = await this.Prisma.channel.update({
      where:{
        name: String(payload[0].name)
      },
      data:{
        password: payload[1]
      },
      include: {
        joined: true,
        muted: true,
        banned: true,
        admins: true
      },
    })
    }
    catch(error){
    console.log(error);
    }
  }



  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, payload: any)
  {
    try{
      this.server.in(client.id).socketsJoin(payload[0] + "_channel");
      let data = await this.Prisma.channel.update({
        where: {
          name: String(payload[0])
        },
        data: {
          joined: {
            connect: [{id: Number(payload[1])}]
          }
        },
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        }
      })
      if (data != null && data != undefined)
      {
        this.server.to(payload[0] + "_channel").emit('someoneJoinedTheChannel', data)
        return data;
      }
    }
    catch(error){
      console.log(error);
    }
  }

  @SubscribeMessage('userInChannelListPlz')
  async updateUserInChannelList(client: Socket, payload: any)
  {
    try{
      let data = await this.Prisma.channel.findFirst({
        where: {
          name: payload
        },
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        }
      })
      if (data != null && data != undefined)
      {
        this.server.to(payload + "_channel").emit('someoneJoinedTheChannel', data.joined)
        return data;
      }
    }
    catch(error){
      console.log(error);
    }
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, payload: any)
  {
    try{
      this.server.in(client.id).socketsLeave(payload[0] + "_channel");
      let data = await this.Prisma.channel.update({
        where: {
          name: payload[0]
        },
        data: {
          joined: {
            disconnect: [{id: Number(payload[1])}]
          }
        },
        include: {
          joined: true,
          muted: true,
          banned: true,
          admins: true,
        }
      })    
      if (data != null && data != undefined)
      {
        this.server.to(payload[0] + "_channel").emit('someoneJoinedTheChannel', data)
        return data;
      }
    }
    catch(err)
    {
      console.log("error dans leaveChannel :");
      console.log(err);
    }
  }

/* INVITATION GAME */

  @SubscribeMessage('CreateRoomToPlay')
  createRoomToPlay(client: Socket, payload: any)
  {
    let RoomName: string = this.createGameRoomName(payload[0].login, payload[1].login);
    this.server.in(client.id).socketsJoin(RoomName);
    this.server.in(payload[1].socket).socketsJoin(RoomName); //Peut etre rechercher en BDD ce socket est mieux (actualisation)
  }

  @SubscribeMessage('invitationIsAccepted')
  acceptInvitation(client: Socket, payload: any)
  {
    this.server.to(payload[0].socket).emit('invitationAccepted');
  }

  @SubscribeMessage('initDisplayInvitation')
  async prepareInvitation(client: Socket, payload: any)
  {
    let invitation:boolean = true;
    let data = await this.Prisma.user.findFirst({
      where: {login: payload[0].login},
    })
    let data2 = await this.Prisma.user.findFirst({
      where: {login: payload[1].login},
    })
    if (data != null && data != undefined)
      this.server.to(data.socket).emit('DisplayInvitation', invitation, data2); //AJOUTER ICI LES INFOS DE LA PARTIE
  }

  @SubscribeMessage('refuseInvitation')
  async refuseInvitation(client:Socket, payload:any)
  {
    let refuse:boolean =true;
    let data = await this.Prisma.user.findFirst({
      where: {login: payload[0].login},
    })
    let data2 = await this.Prisma.user.findFirst({
      where: {login: payload[1]},
    })
    if (data != null && data != undefined)
      this.server.to(data.socket).emit('refuseInvitation', refuse, data2);
  }

/* PONG GAME */

  @SubscribeMessage('moveToServer')
  handleMove(client: any, payload: any): void {
    this.server.emit('moveToClient', payload);
  }

  @SubscribeMessage('gameStatesToServer')
  handleGameStates(client: any, payload: any): void {
    this.server.emit('gameStatesToClient', payload);
  }

/* INIT */

  @SubscribeMessage('startToServer')
  handleStart(client: any, payload: any): void {
    this.server.emit('startToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('getAddFriend')
  async addingFriend(client: Socket, payload: any){
    try{
      let data = await this.Prisma.user.update({
        where: {
          id: Number(payload[0]),
        },
        data:{
          friends: {
            connect: [{id: Number(payload[1])}]
          },
      },
      include: {
        friends: true,
          channel_joined: true,
          muted: true,
          admin_of: true,
          banned: true,
          creatorOf: true,
          blocked: true,
          blockedby: true,
      }
      })
      if (data != null && data != undefined)
      {
        this.server.to(client.id).emit('addFriend', data.friends);
      }
    }
    catch(err){
      console.log("issue dans getAddFriend");
      console.log(err);
    }
  }

  @SubscribeMessage('getRemoveFriend')
  async removingFriend(client: Socket, payload: any){
    try{
      let data = await this.Prisma.user.update({
        where: {
          id: Number(payload[0]),
        },
        data:{
          friends: {
            disconnect: [{id: Number(payload[1])}]
          }
        },
        include: {
          friends: true,
          channel_joined: true,
          muted: true,
          admin_of: true,
          banned: true,
          creatorOf: true,
          blocked: true,
          blockedby: true,
        }
      })
      if (data != null && data != undefined)
      {
        this.server.to(client.id).emit('removeFriend', data.friends);
      }
    }
    catch(err){
      console.log("issue dans le remove friend");
      console.log(err);
    }
  }

  @SubscribeMessage('getFriendList')
  async getFriendList(client: any, payload : any)
  {
    try{
      let data = await this.Prisma.user.findFirst({
        where: {
          id: Number(payload),
        },
        include: {
          friends: {
            include: {
              blockedby: true,
              blocked: true
            }
          },
          channel_joined: true,
          muted: true,
          admin_of: true,
          banned: true,
          creatorOf: true,
          blocked: true,
          blockedby: true,
        },
      })
      if (data != null && data != undefined)
      {
        this.server.to(client.id).emit('listFriends', data.friends);
      }
    }
    catch(err){
      console.log("issue dans le get friend list");
      console.log(err);
    }
  }

  @SubscribeMessage('checkIfFriend')
  async checkIfFriend(client: any, payload: any)
  {
    try{
      let data = await this.Prisma.user.findUnique({
        where: {
          id: Number(payload[0]),
        },
        include: {
          friends: true,
          channel_joined: true,
          muted: true,
          admin_of: true,
          banned: true,
          creatorOf: true,
          blocked: true,
          blockedby: true,
        }
      })
      if (data !== null && data !== undefined){
        const value = data.friends.find((element) => payload[1] === element.id);
        
        if (value !== undefined){
          this.server.to(client.id).emit('findFriendsOrNot', 1);
          
        }
        else{
          this.server.to(client.id).emit('findFriendsOrNot', 0);
 
        }}
      }
    catch(err){
    console.log("issue dans le get friend list");
    console.log(err);
    }
  }

   
  @SubscribeMessage('getBlockUser')
  async getBlockUser(client: Socket, payload: any){
    try{
      let data = await this.Prisma.user.update({
        where: {
          id: Number(payload[0]),
        },
        data:{
          blocked: {
            connect: [{id: Number(payload[1])}]
          },
      },
      include: {
        blocked: true,
      }
      })
      if (data != null && data != undefined)
      {
        this.server.to(client.id).emit('blockedUser', data.blocked);
      }
    }
    catch(err){
      console.log("issue dans getAddBlock");
      console.log(err);
    }
  }

  @SubscribeMessage('getUnblockUser')
  async getUnblockUser(client: Socket, payload: any){
    try{
      let data = await this.Prisma.user.update({
        where: {
          id: Number(payload[0]),
        },
        data:{
          blocked: {
            disconnect: [{id: Number(payload[1])}]
          },
      },
      include: {
        blocked: true,
      }
      })
      if (data != null && data != undefined)
      {
        this.server.to(client.id).emit('unblockedUser', data.blocked);
      }
    }
    catch(err){
      console.log("issue dans getRemoveBlock");
      console.log(err);
    }
  }

  @SubscribeMessage('checkIfBlock')
  async checkIfBlock(client: any, payload: any)
  {
    try{
      let data = await this.Prisma.user.findUnique({
        where: {
          id: Number(payload[0]),
        },
        include: {
          blocked: true,
        }
      })
      if (data !== null && data !== undefined){
        const value = data.blocked.find((element) => payload[1] === element.id);
        if (value !== undefined){
          this.server.to(client.id).emit('findBlockOrNot', 1);
        }
        else{
          this.server.to(client.id).emit('findBlockOrNot', 0);
        }}
      }
    catch(err){
    console.log("issue dans le get blocked list");
    console.log(err);
    }
  }

  @SubscribeMessage('hasBeenBlocked')
  async hasBeenBlocked(client: Socket, payload: any)
  {
    let data = await this.Prisma.user.findFirst({
      where: {
        id: payload[0].id,
      }
    })
    if (data !== null && data !== undefined)
    {
      this.server.to(data.socket).emit("youHaveBeenBlocked", payload[1]);
    }
  }

  @SubscribeMessage('hasBeenUnblocked')
  async hasBeenUnblocked(client: Socket, payload: any)
  {
    let data = await this.Prisma.user.findFirst({
      where: {
        id: payload[0].id,
      }
    })
    if (data !== null && data !== undefined)
    {
      this.server.to(data.socket).emit("youHaveBeenUnblocked", payload[1]);
    }
  }

}
