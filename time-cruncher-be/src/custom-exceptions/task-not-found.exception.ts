import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskNotFoundException extends HttpException{
  constructor(id: number){
    super({message: `Task with id = ${id} not found.`}, HttpStatus.NOT_FOUND);
  }
}