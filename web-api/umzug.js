const createApplicationContext = require('./src/applicationContext');
const path = require('path');
const Umzug = require('umzug');
const applicationContext = createApplicationContext({});

const { forAllRecords } = require('./migrations/utilities');

const ENV = process.argv[2];
const TABLE_NAME = `efcms-${ENV}`;

const documentClient = applicationContext.getDocumentClient();

const getMigrations = async () => {
  let migrations = await documentClient
    .get({
      Key: {
        pk: 'migrationSchema',
        sk: 'migrationSchema',
      },
      TableName: TABLE_NAME,
    })
    .promise();

  if (!migrations.Item) {
    return {
      executed: [],
      pk: 'migrationSchema',
      sk: 'migrationSchema',
    };
  } else {
    return migrations.Item;
  }
};

const logMigration = async migrationName => {
  console.log('Completed Migration: ' + migrationName);
  const migrations = await getMigrations();
  migrations.executed.push(migrationName);
  return documentClient
    .put({
      Item: migrations,
      TableName: TABLE_NAME,
    })
    .promise();
};

const unlogMigration = async migrationName => {
  const migrations = await getMigrations();
  migrations.executed.splice(migrations.executed.indexOf(migrationName), 1);
  return documentClient
    .put({
      Item: migrations,
      TableName: TABLE_NAME,
    })
    .promise();
};

const executed = async () => {
  const migrations = await getMigrations();
  return migrations.executed;
};

// Actually fail the build on failures
process.on('unhandledRejection', up => {
  throw up;
});

const storage = {
  executed,
  getMigrations,
  logMigration,
  unlogMigration,
};

/**
 *
 */
async function run() {
  const umzug = new Umzug({
    migrations: {
      params: [documentClient, TABLE_NAME, forAllRecords],
      path: path.join(__dirname, '/migrations'),
      pattern: /^\d+[\w-]+\.js$/,
    },
    storage,
  });

  try {
    await umzug.up();
  } catch (error) {
    throw new Error(`Error migrating data: ${error}`);
  }
}

run();
