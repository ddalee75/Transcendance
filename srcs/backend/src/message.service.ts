import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async message(
    messageWhereUniqueInput: Prisma.MessageWhereUniqueInput,
  ): Promise<Message | null> {
    try{
      return this.prisma.message.findUnique({
        where: messageWhereUniqueInput,
      });
    }
    catch(err){
      console.log("error dans message service :");
      console.log(err);
    }
  }

  async messages(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MessageWhereUniqueInput;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
  }): Promise<Message[]> {
    try{
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.message.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    }
    catch(err)
    {
      console.log("error dans messageS service :");
      console.log(err);
    }
  }

  async getMessages(params: { fromUserId: Number, userId: Number }): Promise<Message[]> {
    try{
      return await this.prisma.message.findMany({
        where: {
          fromUserId: { in: [Number(params.fromUserId), Number(params.userId)]},
          userId: {in: [Number(params.userId), Number(params.fromUserId)]}
        }
      });
    }
    catch(err){
      console.log("error dans getMessages: ");
      console.log(err);
    }
  }

  async getChannelMessages(params: {channelName: string}): Promise<Message[]> {
    try{
      return await this.prisma.message.findMany({
        where: {
          channelName: params.channelName
        }
      })
    }
    catch(err){
      console.log("error getChannelMessages :");
      console.log(err);
    }
  }

  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    try{
      return await this.prisma.message.create({
        data,
      });
    }
    catch(err){
      console.log("error dans createMessage :");
      console.log(err);
    }
  }

  async createChannelMessage(data: Prisma.MessageCreateInput): Promise<Message>
  {
    try{
      return await this.prisma.message.create({
        data,
      });
    }
    catch(err){
      console.log("error dans createChannelMessage :");
      console.log(err);
    }
  }

  async updateMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    try{
      const { where, data } = params;
      return this.prisma.message.update({
        data,
        where,
      });
    }
    catch(err){
      console.log("error dans updateMessage :");
      console.log(err);
    }
  }

  async deleteMessage(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    try{
      return this.prisma.message.delete({
        where,
      });
    }
    catch(err){
      console.log("error dans deleteMessage :");
      console.log(err);
    }
  }

}
