import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { Channel } from '../models/channel'
import { environment } from 'src/environments/environment';
import { IGameStates } from '../pong/game/interfaces/game-states.interface';
import { IInput } from '../pong/game/interfaces/input.interface';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'https://' + environment.IP_HOST;
  private socket;
  API_SERVER = 'https://' + environment.IP_HOST + '/api';
  target !: User;
  sock :string | undefined = "";

  constructor(private apiService: ApiService) {
    this.socket = io(this.url);
  }

  socketInTotoRoom(){
    this.socket.emit('userInTotoRoom');
  }

  unsubsribeChannelEvent() {
	this.socket.off("channelIsUpdated");
	this.socket.off("someoneJoinedTheChannel");
	this.socket.off("newAdminInChannel");
	this.socket.off("msginchannel");
	this.socket.off("youAreBanned");
  }
  //MUTE

  muteUserByTime(userToMute: number, channelConcerned: number, timeToMute: number)
  {
    this.socket.emit('muteUserByTime', userToMute, channelConcerned, timeToMute);
  }

  muteUser(userToMute: number, channelConcerned: number)
  {
    this.socket.emit('muteUser', userToMute, channelConcerned);
  }

  unmuteUser(userToMute: number, channelConcerned: number)
  {
    this.socket.emit('unmuteUser', userToMute, channelConcerned);
  }


  //Be Admin
  BeAdminSalon(guestToBeAdmin: number, channelConcerned: number){
      this.socket.emit('beAdminSalon', guestToBeAdmin, channelConcerned)
      console.log(2)
  }

  delAdminSalon(guestToDelAdmin: number, channelConcerned: number){
    this.socket.emit('delAdminSalon', guestToDelAdmin, channelConcerned)
    console.log(2)
}
  

//BAN

banUserByTime(userToBan: number, channelConcerned: number, timeToMute: number)
{
  this.socket.emit('banUserByTime', userToBan, channelConcerned, timeToMute);
}

banUser(userToBan: number, channelConcerned: number)
{
  this.socket.emit('banUser', userToBan, channelConcerned);
}

unbanUser(userToBan: number, channelConcerned: number)
{
  this.socket.emit('unbanUser', userToBan, channelConcerned);
}

amIBanned()
{
  return new Observable<any>((obs) => {
    this.socket.on('youAreBanned', (res: number, res2: User[]) => {
      let data = {res, res2}
      obs.next(data)
    })
  })
}

//CONNECTION

  imDisconnected(login: string)
  {
    this.socket.emit('isOffline', login);
    this.socket.emit('imDisconnected');
    this.socket.disconnect();
  }

  imConnected(login: string)
  {
    this.socket.emit('isOnline', login);
    this.socket.emit('imConnected');
  }

  getId(): String{
    return this.socket.id;
  }

  sendLogin(login: string): void {
    this.socket.emit('sendLogin', login);
  }

  //CHANNEL

  async createChannel(channel_name: string, creator_id: number)
  {
    this.socket.emit('createChannel', channel_name, creator_id, () => { 
      this.socket.emit('joinChannel', channel_name, creator_id);
      // this.socket.emit('userInChannelListPlz', channel_name);
    });
  }

  getConnectionSignal(current_id: number)
  {
    return new Observable((obs) => {
      this.socket.on('userListUpdated', () => {
      this.socket.emit('userListPlz', current_id);
      obs.next();
      })
    })
  }

  verifyPassword(password: string, channel_name: string)
  {
    this.socket.emit('verifyPassword', password, channel_name);
  }

  getPassVerifResponse()
  {
    return new Observable<boolean>((obs) => {
      this.socket.on('goodPassword', (res: boolean) => {
        obs.next(res);
      })
      this.socket.on('wrongPassword', (res: boolean) => {
        obs.next(res);
      })
    })
  }

  stopListeningPassVerifResponse()
  {
    this.socket.off('goodPassword');
    this.socket.off('wrongPassword');
  }

//UPDATE CHANNEL

  async updateChannel()
  {
    this.socket.emit('channelToUpdate');
  }

  async updateChannels()
  {
    this.socket.emit('channelsToUpdate');
  }

  async getUpdateChannel()
  {
    return new Observable<Channel>((obs)=>{
    this.socket.on('channelIsUpdated', (data: Channel) => {
      obs.next(data);
    })
  })
  }

  async getUpdateChannels()
  {
    return new Observable<Channel[]>((obs)=>{
      this.socket.on('channelsAreUpdated', (data: Channel[]) => {
        obs.next(data);
      })
    }) 
  }

  getAllUser()
  {
    return new Observable<User[]>((obs) => {
      this.socket.on('hereIsTheUserList', (res: User[]) => {
        // console.log("HEREISTHEUSERLIST OK =>")
        // console.log(res);
        obs.next(res);
      })
  })
  }

  createPrivChannel(channel_name: string, creator_id: number, password?: string)
  {
    this.socket.emit('createPrivChannel', channel_name, creator_id, password, () => { 
      this.socket.emit('joinChannel', channel_name, creator_id);
    });
  }

  updateChannelList() : Observable<Channel[]>
  {
    return new Observable<Channel[]>((observer) => {
      this.socket.on('aChannelHasBeenCreated', (data) => {
        observer.next(data);
      })
    })
  }

  resetChannelPassword(channel:Channel, new_pwd:string){

    this.socket.emit('resetChannelPassword', channel, new_pwd); 
  }

  joinChannel(channel_name: string, id: number)
  {
    this.socket.emit('joinChannel', channel_name, id);
  }

  leaveChannel(channel_name: string, id: number)
  {
    this.socket.emit('leaveChannel', channel_name, id);
  }

  sendMsgToChannel(channel_name: string, message: string, from: string) : void
  {
    this.socket.emit('MsgInChannel', channel_name, from, message);
  }

  getMsgFromChannel() : Observable<string>
  {
    return new Observable<string>((observer) => {
      this.socket.on('msginchannel', (msg) => {
        observer.next(msg)
      });
    });
  }

  updateUserInSalonList(current_channel_name: string)
  {
    this.socket.emit('userInChannelListPlz', current_channel_name);
  }

  //USER

  askForUserList(current_id: number)
  {
    this.socket.emit('userListPlz', current_id);
  }

  updateUserList() : Observable<User[]>
  {
    return new Observable<User[]>((observer) => {
        this.socket.on('someoneJoinedTheChannel', (data) => {
          observer.next(data.joined);
        });
  
      });
  };

  updateAdminList() : Observable<User[]>
  {
    return new Observable<User[]>((obs) => {
      this.socket.on('newAdminInChannel', (res) => {
        obs.next(res);
      })
    })
  }
        
  searchForAUser(login:string)
  {
    this.socket.emit('SearchForThisUser', login);
  }

  waitForAUser()
  {
    return new Observable<User>((obs) => {
      this.socket.on('hereIsTheUserYouAskedFor', (res) => {
        obs.next(res);
      })
    })
  }

  updateUser(current: User)
  {
    this.socket.emit('updateUser', current);
  }

  getUserUpdated()
  {
    return new Observable<User> ((obs) => {
      this.socket.on("userUpdated", (res) => {
        obs.next(res);
      })
    })
  }

//START COMPONENT

  iAmReady()
  {
    return new Observable(obs => {
      this.socket.on('youAreReady', () => {
        obs.next();
      })
    })
  }

  //PRIV MESSAGE

  sendMessage(message: string): void {
    this.socket.emit('msgToServer', message);
  }

  sendMessageTo(message: string, login1: string, login2: string, nickname: string): void
  {
    this.socket.emit('sendMsgTo', message, "", login1, login2, nickname)
  };

  getMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('PrivMsg', (message) => {
        observer.next(message);
      });
    });
  }

  initDestActualisation(dest: User){
    this.socket.emit('ActualisationDest', dest);
  }

  destActualisation(): Observable<User> {
    return new Observable<User>((obs) => {
      this.socket.on('DestActualisation', (res) => {
        obs.next(res);
      });
    });
  }

  //INVITATION GAME

  initSessionToPlay(player1: User, player2: User){
    this.socket.emit('CreateRoomToPlay', player1, player2);
  }

  isGameReady(){
    return new Observable<boolean>((obs) => {
      this.socket.on('GameIsReady', () => {
        obs.next(true);
      })
    })
  }

  displayInvitation(target: User, target2:User){
    this.socket.emit('initDisplayInvitation', target, target2);
  }

  refuseInvitation(target: User, target2:string){
    this.socket.emit('refuseInvitation', target, target2);
  }

  doIHaveToDisplay(){
    return new Observable<any>((obs) => {
      this.socket.on('DisplayInvitation', (res:boolean, res2: User) => {
        let data = {res, res2}
        obs.next(data);
      })
    })
  }


  showrefuseInvitation(){
    return new Observable<any>((obs) => {
      this.socket.on('refuseInvitation', (res:boolean, res2: User) => {
        let data = {res, res2}
        obs.next(data);
      })
    })
  }


  acceptInvitation(target: User){
    this.socket.emit('invitationIsAccepted', target);
  }

  isGameAccepted(){
    return new Observable<boolean>((obs) => {
      this.socket.on('invitationAccepted', () => {
        obs.next(true);
      })
    })
  }

  //PONG GAME

  sendMove(move: IInput): void {
    this.socket.emit('moveToServer', move);
  }

  getMove(): Observable<IInput> {
    return new Observable<IInput>((observer) => {
      this.socket.on('moveToClient', (message) => {
        observer.next(message);
      });
    });
  }

  sendGameStates(gameStates: IGameStates): void {
    this.socket.emit('gameStatesToServer', gameStates);
  }

  getGameStates(): Observable<IGameStates> {
    return new Observable<IGameStates>((observer) => {
      this.socket.on('gameStatesToClient', (message) => {
        observer.next(message);
      });
    });
  }

//INIT

  sendStart(): void {
    this.socket.emit('startToServer');
  }

  getStart() {
    return new Observable<void>((observer) => {
      this.socket.on('startToClient', (payload) => {
        observer.next(payload);
      });
    });
  }

  getAddFriend(id: number, id1: number){
    //this.socket.on('getAddFriend');
    this.socket.emit('getAddFriend', id, id1);
  }

  getFriend(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      this.socket.on('addFriend', (tab: User[]) => {
        observer.next(tab);
      });
    });
  }

  getRemoveFriend(id: number, id1: number){
    this.socket.emit('getRemoveFriend', id, id1);
  }

  removeFriend(): Observable<User[]> {
    return new Observable<User[]>((obs) => {
      this.socket.on('removeFriend', (tab: User[]) => {
        obs.next(tab);
      });
    });
  }

  getFriendList(id: number){
    this.socket.emit('getFriendList', id);
  }

  listFriend(): Observable<User[]> {
    return new Observable<User[]>((obs) => {
      this.socket.on('listFriends', (tab: User[]) => {
        obs.next(tab);
      });
    });
  }

  updateListFriend(id: number){
    this.socket.emit('getFriendList', id);
  }

  checkIfFriend(id: number, id1: number){
    this.socket.emit('checkIfFriend', id, id1);
  }

  findFriendsOrNot(): Observable<number> {
    return new Observable<number>((obs) => {
      this.socket.on('findFriendsOrNot', (index: number) => {
        obs.next(index);
        // console.log(`find friend or not ${index}`);
      })
    })
  }

//Block User

  getBlockUser(id: number, id1: number){
   this.socket.emit('getBlockUser', id, id1);
  }

  blockedUser(): Observable<User[]> {    
   return new Observable<User[]>((obs) => {
     this.socket.on('blockedUser', (tab: User[]) => {
       obs.next(tab);
     });
   });
  }

  hasBeenBlocked(dest: User, Me: User)
  {
    this.socket.emit('hasBeenBlocked', dest, Me);
  }

  getUserListWhenBlocked()
  {
    return new Observable<User> ((obs) => {
      this.socket.on('youHaveBeenBlocked', (data: User) => {
        obs.next(data);
      })
    })
  }

//Unblock User

  getUnblockUser(id: number, id1: number){
   this.socket.emit('getUnblockUser', id, id1);
  }

  unblockedUser(): Observable<User[]> {
   return new Observable<User[]>((obs) => {
    this.socket.on('unblockedUser', (tab: User[]) => {
        obs.next(tab);
      });
    });
  }

  checkIfBlock(id: number, id1: number){
    this.socket.emit('checkIfBlock', id, id1);
  }

  findBlockOrNot(): Observable<number> {
    return new Observable<number>((obs) => {
      this.socket.on('findBlockOrNot', (index: number) => {
        obs.next(index);
        // console.log(`find block or not ${index}`);
      })
    })
  }

  hasBeenUnblocked(dest: User, Me: User)
  {
    this.socket.emit('hasBeenUnblocked', dest, Me);
  }

  getUserListWhenUnblocked()
  {
    return new Observable<User> ((obs) => {
      this.socket.on('youHaveBeenUnblocked', (data: User) => {
        obs.next(data);
      })
    })
  }

}
