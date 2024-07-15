import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Message } from '../web-api/src/persistence/repository/Message';

export const AppDataSource = new DataSource({
  database: 'postgres',
  entities: [Message],
  host: 'localhost',
  logging: false,
  migrations: ['migrations/*.ts'],
  password: 'example',
  port: 5432,
  subscribers: [],
  synchronize: true,
  type: 'postgres',
  username: 'postgres',
});

const dataSource = AppDataSource.initialize().then(() => AppDataSource);
export const getDataSource = () => dataSource;
