// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Conversation } from './lib/db/entities/Conversation';
import { Message } from './lib/db/entities/Message';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Conversation, Message],
  migrations: ['src/lib/db/migrations/*.ts'],
  synchronize: false, // we’re using migrations now
  logging: false,
});

export default AppDataSource; // 👈 required by TypeORM CLI
