import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Conversation } from './Conversation';

export type MessageRole = 'user' | 'assistant' | 'system';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ['user', 'assistant', 'system'],
    default: 'user',
  })
  @Index()
  role!: MessageRole;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Conversation, {
    onDelete: 'CASCADE',
  })
  conversation!: Conversation;
}
