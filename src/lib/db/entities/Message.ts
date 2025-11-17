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

  @Column()
  @Index()
  role!: MessageRole;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Conversation, conversation => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation!: Conversation;
}
