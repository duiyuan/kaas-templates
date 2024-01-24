import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'

export class UserValidator {
  @IsNotEmpty()
  address: string
}
