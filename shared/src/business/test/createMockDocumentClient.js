const {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');

const mockDynamoUsers = {
  ['user|1805d1ab-18d0-43ec-bafb-654e83405416 user|1805d1ab-18d0-43ec-bafb-654e83405416']:
    {
      email: 'docketclerk@example.com',
      name: 'Test Docketclerk',
      pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      sk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ['user|3805d1ab-18d0-43ec-bafb-654e83405416 user|3805d1ab-18d0-43ec-bafb-654e83405416']:
    {
      email: 'petitionsclerk@example.com',
      name: 'Test Petitionsclerk',
      pk: 'user|3805d1ab-18d0-43ec-bafb-654e83405416',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      sk: 'user|3805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ['user|7805d1ab-18d0-43ec-bafb-654e83405416 user|7805d1ab-18d0-43ec-bafb-654e83405416']:
    {
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      pk: 'user|7805d1ab-18d0-43ec-bafb-654e83405416',
      role: ROLES.petitioner,
      sk: 'user|7805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ['user|a805d1ab-18d0-43ec-bafb-654e83405416 user|a805d1ab-18d0-43ec-bafb-654e83405416']:
    {
      email: 'pettitionsclerk@example.com',
      name: 'Alex Petitionsclerk',
      pk: 'user|a805d1ab-18d0-43ec-bafb-654e83405416',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      sk: 'user|a805d1ab-18d0-43ec-bafb-654e83405416',
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    },
};

const createMockDocumentClient = () => {
  return {
    batchGet: jest.fn().mockImplementation(({ RequestItems }) => {
      const { Keys } = RequestItems['efcms-local'];
      const arr = [];
      for (let { pk, sk } of Keys) {
        arr.push(mockDynamoUsers[`${pk} ${sk}`]);
      }
      return {
        promise: async () => ({
          Responses: {
            ['efcms-local']: arr,
          },
        }),
      };
    }),
    batchWrite: jest.fn().mockImplementation(() => {
      return {
        promise: async () => null,
      };
    }),
    delete: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      delete mockDynamoUsers[`${pk} ${sk}`];
      return {
        promise: async () => null,
      };
    }),
    get: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      return {
        promise: async () => ({
          Item: mockDynamoUsers[`${pk} ${sk}`],
        }),
      };
    }),
    getData: () => mockDynamoUsers,
    put: jest.fn().mockImplementation(({ Item }) => {
      mockDynamoUsers[`${Item.pk} ${Item.sk}`] = Item;
      return {
        promise: async () => null,
      };
    }),
    query: jest
      .fn()
      .mockImplementation(({ ExpressionAttributeValues, IndexName }) => {
        const arr = [];
        for (let key in mockDynamoUsers) {
          if (IndexName === 'gsi1') {
            const gsi1pk = ExpressionAttributeValues[':gsi1pk'];
            if (mockDynamoUsers[key].gsi1pk === gsi1pk) {
              arr.push(mockDynamoUsers[key]);
            }
          } else {
            const value = ExpressionAttributeValues[':pk'];
            const prefix = ExpressionAttributeValues[':prefix'];
            const [pk, sk] = key.split(' ');

            if (prefix) {
              if (pk === value && sk.indexOf(prefix) === 0) {
                arr.push(mockDynamoUsers[key]);
              }
            } else if (pk.includes(value)) {
              arr.push(mockDynamoUsers[key]);
            }
          }
        }
        return {
          promise: async () => ({
            Items: arr,
          }),
        };
      }),
    queryFull: jest
      .fn()
      .mockImplementation(({ ExpressionAttributeValues, IndexName }) => {
        const arr = [];
        for (let key in mockDynamoUsers) {
          if (IndexName === 'gsi1') {
            const gsi1pk = ExpressionAttributeValues[':gsi1pk'];
            if (mockDynamoUsers[key].gsi1pk === gsi1pk) {
              arr.push(mockDynamoUsers[key]);
            }
          } else {
            const value = ExpressionAttributeValues[':pk'];
            const prefix = ExpressionAttributeValues[':prefix'];
            const [pk, sk] = key.split(' ');

            if (prefix) {
              if (pk === value && sk.indexOf(prefix) === 0) {
                arr.push(mockDynamoUsers[key]);
              }
            } else if (pk.includes(value)) {
              arr.push(mockDynamoUsers[key]);
            }
          }
        }
        return {
          promise: async () => ({
            Items: arr,
          }),
        };
      }),
    update: jest
      .fn()
      .mockImplementation(
        ({
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          Key,
          UpdateExpression,
        }) => {
          for (let expressionAttributeName in ExpressionAttributeNames) {
            UpdateExpression = UpdateExpression.replace(
              expressionAttributeName,
              ExpressionAttributeNames[expressionAttributeName],
            );
          }

          const hasSet = UpdateExpression.includes('SET');
          UpdateExpression = UpdateExpression.replace('SET', '').trim();
          const expressions = UpdateExpression.split(',').map(t => t.trim());
          const gg = expressions.map(v => v.split('=').map(x => x.trim()));
          let obj = {};
          for (let [k, v] of gg) {
            v = ExpressionAttributeValues[v];
            if (v === 'true' || v === 'false') {
              obj[k] = v === 'true';
            } else {
              if (k.includes('workItem')) {
                obj = mockDynamoUsers[`${Key.pk} ${Key.sk}`];
                // eslint-disable-next-line security/detect-eval-with-expression
                eval(`obj.${k} = ${JSON.stringify(v)};`);
              } else {
                obj[k] = v;
              }
            }
          }

          if (hasSet) {
            mockDynamoUsers[`${Key.pk} ${Key.sk}`] = {
              ...mockDynamoUsers[`${Key.pk} ${Key.sk}`],
              ...obj,
            };
          } else {
            let { id } = mockDynamoUsers[`${Key.pk} ${Key.sk}`] || {};
            mockDynamoUsers[`${Key.pk} ${Key.sk}`] = {
              id: (id || 0) + 1,
            };
          }
          return {
            promise: async () => ({
              Attributes: mockDynamoUsers[`${Key.pk} ${Key.sk}`],
            }),
          };
        },
      ),
    updateConsistent: jest.fn().mockImplementation(() => {
      return {
        promise: async () => null,
      };
    }),
  };
};

module.exports = { createMockDocumentClient };
