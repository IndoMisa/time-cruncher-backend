import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './DTOs/create-comment.dto';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { EditCommentDto } from './DTOs/edit-comment.dto';
import { CommentNotFoundException } from '../../custom-exceptions/comment-not-found.exception';
import { pusher } from '../../pusher';
import { AuthGuard } from '@nestjs/passport';
@Controller('comments')
@UseGuards(AuthGuard('bearer'))
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    ) {}
  @Get()
  async findAllComments(): Promise<Comment[]>{
    return await this.commentService.findAll();
  }

  @Get(':id')
  async findCommentById(@Param() params){
    return await this.commentService.findById(params.id);
  }

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto){
    const creator = await this.userService.findById(createCommentDto.creatorId);
    const task = await this.taskService.findByIdWithGroup(createCommentDto.taskId);
    const newComment: Partial<Comment> = {text: createCommentDto.text, creator, task};
    const res: Comment = await this.commentService.create(newComment as Comment);
    pusher.trigger('private-channel_for_group-' + task.group.id, 'comment_added', JSON.stringify(res));
    return res;
  }

  @Delete(':id')
  async deleteComment(@Param() params){
    if (!await this.commentService.existsWithId(params.id))
      throw new CommentNotFoundException(params.id);
    const res = await this.commentService.delete(params.id);
    if (res.raw.affectedRows === 0)
      throw new HttpException({message: 'There was an error with comment removal.'}, HttpStatus.INTERNAL_SERVER_ERROR);
    return {message: `Comment with id = ${params.id} successfully removed`};
  }

  @Put(':id')
  async editComment(@Param() params, @Body() editCommentDto: EditCommentDto){
    const comment: Comment = await this.commentService.findById(params.id);
    comment.text = editCommentDto.text;
    return this.commentService.edit(comment);
  }
}
