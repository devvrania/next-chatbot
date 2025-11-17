
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Conversation } from './db/entities/Conversation';
import { Message } from './db/entities/Message';


const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Conversation, Message],
  synchronize: !isProd, // auto sync in dev, use migrations in prod
  logging: false,
});
