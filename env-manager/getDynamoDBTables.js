const { filter } = require('lodash');

exports.getDynamoDBTables = async ({ dynamoDB, environment }) => {
  const { TableNames } = await dynamoDB.listTables({}).promise();
  return filter(TableNames, table => {
    return table.TableName.includes(`-${environment.name}`);
  });
};
