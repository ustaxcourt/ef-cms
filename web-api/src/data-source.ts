import 'reflect-metadata';
import { Case } from '@web-api/persistence/repository/Case';
import { DataSource } from 'typeorm';
import { Message } from './persistence/repository/Message';

export const AppDataSource = new DataSource({
  database: 'postgres',
  entities: [Message, Case],
  host: 'localhost',
  logging: true,
  migrations: ['postgres/migrations/*.ts'],
  password: 'example',
  port: 5432,
  subscribers: [],
  synchronize: true,
  type: 'postgres',
  username: 'postgres',
});

const dataSource = AppDataSource.initialize().then(() => AppDataSource);
export const getDataSource = () => dataSource;
