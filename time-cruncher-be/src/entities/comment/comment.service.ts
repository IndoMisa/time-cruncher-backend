import { Injectable } from '@nestjs/common';
import {Comment} from './comment.entity';
import { Repository } from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { CommentNotFoundException } from '../../custom-exceptions/comment-not-found.exception';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ){}
  async findAll(): Promise<Comment[]>{
    return await this.commentRepository.find();
  }
  async findById(id: number): Promise<Comment> {
    const res: Comment = await this.commentRepository.findOne(id);
    if (!res)
      throw new CommentNotFoundException(id);
    return res;
  }

  async create(newComment: Comment): Promise<Comment>{
    const res: Comment = await this.commentRepository.save(newComment);
    return res;
  }
  async delete(id: number){
    if (!this.existsWithId(id))
      throw new CommentNotFoundException(id);
    return await this.commentRepository.delete(id);
  }
  async edit(comment: Comment): Promise<Comment>{
    const res = await this.commentRepository.save(comment);
    return res;
  }
  async existsWithId(id: number){
    return (await this.commentRepository.findOne(id)) !== undefined;
  }
}
