import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupNotFoundException extends HttpException{
  constructor(id: number){
    super({message: `Group with id = ${id} not found.`}, HttpStatus.NOT_FOUND);
  }
}