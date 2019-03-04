import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException{
  constructor(id: number){
    super({message: `Comment with id = ${id} not found.`}, HttpStatus.NOT_FOUND);
  }
}