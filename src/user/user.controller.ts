import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import {UserValidator } from '../common/validator'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UserEntity } from 'src/common/apiResponse'
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private user: UserService) {}

  @Get()
  @ApiQuery({ name: 'address', required: true })
  @ApiOkResponse({
    type: UserEntity,
  })
  getUser(@Query() { address }: UserValidator): Promise<User | null> {
    return this.user.getUser(address)
  }

}
