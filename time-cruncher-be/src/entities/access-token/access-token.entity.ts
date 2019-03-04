import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class AccessToken{
  @PrimaryColumn({
    type: "varchar",
    length: 25,
  })
  token: string;
  @OneToOne(type => User, user => user.accessToken, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

}