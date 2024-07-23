import 'reflect-metadata';
import { Case } from '@web-api/persistence/repository/Case';
import { DataSource } from 'typeorm';
import { Message } from './persistence/repository/Message';
import fs from 'fs';

export const AppDataSource = new DataSource({
  database: 'postgres',
  entities: [Message, Case],
  host: process.env.POSTGRES_HOST,
  logging: true,
  migrations: ['postgres/migrations/*.ts'],
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.CIRCLE_BRANCH
      ? {
          ca: fs.readFileSync('us-east-1-bundle.pem').toString(),
        }
      : undefined,
  subscribers: [],
  type: 'postgres',
  username: process.env.POSTGRES_USERNAME,
});

const dataSource = AppDataSource.initialize().then(() => AppDataSource);
export const getDataSource = () => dataSource;
