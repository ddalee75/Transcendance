import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Tech, Prisma } from '@prisma/client';

@Injectable()
export class TechService {
  constructor(private prisma: PrismaService) {}

  async tech(
    techWhereUniqueInput: Prisma.TechWhereUniqueInput,
  ): Promise<Tech | null> {
    return this.prisma.tech.findUnique({
      where: techWhereUniqueInput,
    });
  }

  async techs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TechWhereUniqueInput;
    where?: Prisma.TechWhereInput;
    orderBy?: Prisma.TechOrderByWithRelationInput;
  }): Promise<Tech[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tech.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTech(data: Prisma.TechCreateInput): Promise<Tech> {
    return this.prisma.tech.create({
      data,
    });
  }

  async updateTech(params: {
    where: Prisma.TechWhereUniqueInput;
    data: Prisma.TechUpdateInput;
  }): Promise<Tech> {
    const { where, data } = params;
    return this.prisma.tech.update({
      data,
      where,
    });
  }

  async deleteTech(where: Prisma.TechWhereUniqueInput): Promise<Tech> {
    return this.prisma.tech.delete({
      where,
    });
  }
}
