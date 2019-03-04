import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany} from 'typeorm';
import {User} from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class Group{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: "varchar",
    length: 50,
  })
  name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 200,
  })
  description: string;

  @Column({
    nullable: false,
  })
  isPrivate: boolean;

  @ManyToMany(type => User, user => user.groups, {nullable: false, cascade: true})
  users: User[];

  @OneToMany(type => Task, task => task.group)
  tasks: Task[];
}