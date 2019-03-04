import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException{
  constructor(id: number){
    super({message: `User with id = ${id} not found.`}, HttpStatus.NOT_FOUND);
  }
}