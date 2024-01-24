import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'
import {  httpAgent } from '../common/utils'

@Injectable()
export class UserService {
  private readonly logger = new Logger('user')
  client = null
  constructor(private prisma: PrismaService) {
    this.client = new TwitterApi(
      {
        clientId: process.env.TWITTER_APP_KEY,
        clientSecret: process.env.TWITTER_APP_SECRET,
      },
      { httpAgent },
    )
  }

  async getUser(address: string): Promise<User | null> {
    return (
      this.prisma.user.findUnique({
        where: { address },
        include: {
          invitee: {
            select: {
              address: true,
            },
          },
          belongTribe: {
            select: {
              name: true,
            },
          },
        },
      }) || null
    )
  }
}
