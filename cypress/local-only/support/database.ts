import fs from 'fs';
import { Pool } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';

interface Database {
  dwFeatureFlag: {
    name: string;
    value: { current: any };
  };
}

const pool = {
  database: 'postgres',
  host: 'localhost',
  idleTimeoutMillis: 1000,
  max: 1,
  password: 'example',
  port: 5432,
  user: 'postgres',
  ssl: undefined,
};
const postgres = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool(pool),
  }),
  plugins: [new CamelCasePlugin()],
});

export const setAllowedTerminalIpAddresses = async (ipAddresses: string[]) => {
  const values = {
    name: 'allowed-terminal-ips',
    value: { current: ipAddresses },
  };
  await postgres
    .insertInto('dwFeatureFlag')
    .values(values)
    .onConflict(oc => oc.column('name').doUpdateSet(values))
    .execute();
  return null;
};

export const deleteAllFilesInFolder = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) return null;
  fs.rmSync(directoryPath, { recursive: true });
  return null;
};

export const ensureFolderExists = (directory: string) => {
  if (fs.existsSync(directory)) return null;
  fs.mkdirSync(directory);
  return null;
};

export const fileExists = (fileName: string): boolean => {
  const downloadsFolder = 'cypress/downloads';
  const fileLocation = `${downloadsFolder}/${fileName}`;
  return fs.existsSync(fileLocation);
};
