import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'

class TaskDetail {
  @ApiProperty()
  status: number

  @ApiProperty()
  finished: number
}
class Task1 {
  @ApiProperty({
    type: TaskDetail,
  })
  task1: {
    status: number
    finished: number
  }
}
export class UserEntity implements User {
  @ApiProperty()
  id: string
  @ApiProperty()
  address: string
  @ApiProperty()
  tweetUserID: string
  @ApiProperty()
  tweetName: string
  @ApiProperty({
    type: Task1,
  })
  taskObject: {
    task1: {
      status: number
      finished: number
    }
  }
  @ApiProperty()
  score: number
  @ApiProperty()
  createAt: Date
  @ApiProperty()
  updateAt: Date
  @ApiProperty()
  inviterAddr: string
  @ApiProperty()
  belongTribeId: string
  @ApiProperty()
  invitecode: string
  @ApiProperty()
  shareTribeTweet: string
}
