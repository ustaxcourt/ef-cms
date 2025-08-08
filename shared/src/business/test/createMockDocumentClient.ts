import { cloneDeep } from 'lodash';

const mockDynamoRecords = {};

export const createMockDocumentClient = () => {
  return {
    batchGet: jest.fn().mockImplementation(({ RequestItems }) => {
      const { Keys } = RequestItems['efcms-local'];
      const arr = [];
      for (const { pk, sk } of Keys) {
        arr.push(cloneDeep(mockDynamoRecords[`${pk} ${sk}`]));
      }
      return Promise.resolve({
        Responses: {
          ['efcms-local']: arr,
        },
      });
    }),
    batchWrite: jest.fn().mockImplementation(() => {
      return Promise.resolve(null);
    }),
    delete: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      delete mockDynamoRecords[`${pk} ${sk}`];
      return Promise.resolve(null);
    }),
    get: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      return Promise.resolve({
        Item: cloneDeep(mockDynamoRecords[`${pk} ${sk}`]),
      });
    }),
    getData: () => mockDynamoRecords,
    getFromDeployTable: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      return Promise.resolve({
        Item: cloneDeep(mockDynamoRecords[`${pk} ${sk}`]),
      });
    }),
    put: jest.fn().mockImplementation(({ Item }) => {
      mockDynamoRecords[`${Item.pk} ${Item.sk}`] = Item;
      return Promise.resolve(null);
    }),
    query: jest
      .fn()
      .mockImplementation(({ ExpressionAttributeValues, IndexName }) => {
        const arr = [];
        for (const key in mockDynamoRecords) {
          if (IndexName === 'gsi1') {
            const gsi1pk = ExpressionAttributeValues[':gsi1pk'];
            if (mockDynamoRecords[key].gsi1pk === gsi1pk) {
              arr.push(cloneDeep(mockDynamoRecords[key]));
            }
          } else {
            const value = ExpressionAttributeValues[':pk'];
            const prefix = ExpressionAttributeValues[':prefix'];
            const [pk, sk] = key.split(' ');

            if (prefix) {
              if (pk === value && sk.indexOf(prefix) === 0) {
                arr.push(cloneDeep(mockDynamoRecords[key]));
              }
            } else if (pk.includes(value)) {
              arr.push(cloneDeep(mockDynamoRecords[key]));
            }
          }
        }
        return Promise.resolve({
          Items: arr,
        });
      }),
    queryFull: jest
      .fn()
      .mockImplementation(({ ExpressionAttributeValues, IndexName }) => {
        const arr = [];
        for (const key in mockDynamoRecords) {
          if (IndexName === 'gsi1') {
            const gsi1pk = ExpressionAttributeValues[':gsi1pk'];
            if (mockDynamoRecords[key].gsi1pk === gsi1pk) {
              arr.push(cloneDeep(mockDynamoRecords[key]));
            }
          } else {
            const value = ExpressionAttributeValues[':pk'];
            const prefix = ExpressionAttributeValues[':prefix'];
            const [pk, sk] = key.split(' ');

            if (prefix) {
              if (pk === value && sk.indexOf(prefix) === 0) {
                arr.push(cloneDeep(mockDynamoRecords[key]));
              }
            } else if (pk.includes(value)) {
              arr.push(cloneDeep(mockDynamoRecords[key]));
            }
          }
        }
        return Promise.resolve({
          Items: arr,
        });
      }),
    scan: jest.fn().mockImplementation(({ Key: { pk, sk } }) => {
      return Promise.resolve({
        Item: cloneDeep(mockDynamoRecords[`${pk} ${sk}`]),
      });
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
          for (const expressionAttributeName in ExpressionAttributeNames) {
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
          // eslint-disable-next-line prefer-const
          for (let [k, v] of gg) {
            v = ExpressionAttributeValues[v];
            if (v === 'true' || v === 'false') {
              obj[k] = v === 'true';
            } else {
              if (k.includes('workItem')) {
                obj = mockDynamoRecords[`${Key.pk} ${Key.sk}`];
                eval(`obj.${k} = ${JSON.stringify(v)};`);
              } else {
                obj[k] = v;
              }
            }
          }

          if (hasSet) {
            mockDynamoRecords[`${Key.pk} ${Key.sk}`] = {
              ...mockDynamoRecords[`${Key.pk} ${Key.sk}`],
              ...obj,
            };
          } else {
            const { id } = mockDynamoRecords[`${Key.pk} ${Key.sk}`] || {};
            mockDynamoRecords[`${Key.pk} ${Key.sk}`] = {
              id: (id || 0) + 1,
            };
          }
          return Promise.resolve({
            Attributes: cloneDeep(mockDynamoRecords[`${Key.pk} ${Key.sk}`]),
          });
        },
      ),
    updateConsistent: jest.fn().mockImplementation(() => {
      return Promise.resolve(null);
    }),
  };
};
