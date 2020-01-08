const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const { createUsers } = require('./createUsers');

const client = new AWS.DynamoDB.DocumentClient({
    credentials: {
        accessKeyId: 'noop',
        secretAccessKey: 'noop',
    },
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
});

module.exports.seedLocalDatabase = async (entries = seedEntries) => {
    await createUsers();

    // Seed db from json.
    await Promise.all(
        entries.map(item =>
            client
                .put({
                    Item: item,
                    TableName: 'efcms-local',
                })
                .promise(),
        ),
    );
};
