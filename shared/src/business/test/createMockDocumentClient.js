const createMockDocumentClient = () => {
  const data = {
    ['1805d1ab-18d0-43ec-bafb-654e83405416 1805d1ab-18d0-43ec-bafb-654e83405416']: {
      email: 'docketclerk',
      name: 'Test Docketclerk',
      pk: '1805d1ab-18d0-43ec-bafb-654e83405416',
      role: 'docketclerk',
      section: 'docket',
      sk: '1805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
    ['3805d1ab-18d0-43ec-bafb-654e83405416 3805d1ab-18d0-43ec-bafb-654e83405416']: {
      email: 'pettitionsclerk',
      name: 'Test Petitionsclerk',
      pk: '3805d1ab-18d0-43ec-bafb-654e83405416',
      role: 'petitionsclerk',
      section: 'petitions',
      sk: '3805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
  };

  return {
    batchGet: ({ RequestItems }) => {
      const { Keys } = RequestItems['efcms-local'];
      const arr = [];
      for (let { pk, sk } of Keys) {
        arr.push(data[`${pk} ${sk}`]);
      }
      return {
        promise: async () => ({
          Responses: {
            ['efcms-local']: arr,
          },
        }),
      };
    },
    delete: ({ Key: { pk, sk } }) => {
      delete data[`${pk} ${sk}`];
      return {
        promise: async () => null,
      };
    },
    get: ({ Key: { pk, sk } }) => {
      return {
        promise: async () => ({
          Item: data[`${pk} ${sk}`],
        }),
      };
    },
    getData: () => data,
    put: ({ Item }) => {
      data[`${Item.pk} ${Item.sk}`] = Item;
      return {
        promise: async () => null,
      };
    },
    query: ({ IndexName, ExpressionAttributeValues }) => {
      const arr = [];
      for (let key in data) {
        if (IndexName === 'gsi1') {
          const gsi1pk = ExpressionAttributeValues[':gsi1pk'];
          if (data[key].gsi1pk === gsi1pk) {
            arr.push(data[key]);
          }
        } else {
          const value = ExpressionAttributeValues[':pk'];
          const prefix = ExpressionAttributeValues[':prefix'];
          const [pk, sk] = key.split(' ');

          if (prefix) {
            if (pk === value && sk.indexOf(prefix) === 0) {
              arr.push(data[key]);
            }
          } else if (pk.indexOf(value) !== -1) {
            arr.push(data[key]);
          }
        }
      }
      return {
        promise: async () => ({
          Items: arr,
        }),
      };
    },
    update: ({
      Key,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression,
    }) => {
      for (let name in ExpressionAttributeNames) {
        UpdateExpression = UpdateExpression.replace(
          name,
          ExpressionAttributeNames[name],
        );
      }

      const hasSet = UpdateExpression.indexOf('SET') !== -1;
      UpdateExpression = UpdateExpression.replace('SET', '').trim();
      const expressions = UpdateExpression.split(',').map(t => t.trim());
      const gg = expressions.map(v => v.split('=').map(x => x.trim()));
      let obj = {};
      for (let [k, v] of gg) {
        v = ExpressionAttributeValues[v];
        if (v === 'true' || v === 'false') {
          obj[k] = v === 'true';
        } else {
          if (k.indexOf('documents[') !== -1) {
            obj = data[`${Key.pk} ${Key.sk}`];
            eval(`obj.${k} = ${JSON.stringify(v)};`);
          } else {
            obj[k] = v;
          }
        }
      }

      if (hasSet) {
        data[`${Key.pk} ${Key.sk}`] = {
          ...data[`${Key.pk} ${Key.sk}`],
          ...obj,
        };
      } else {
        let id = (data[`${Key.pk} ${Key.sk}`] || {}).id;
        data[`${Key.pk} ${Key.sk}`] = {
          id: (id || 0) + 1,
        };
      }
      return {
        promise: async () => ({
          Attributes: data[`${Key.pk} ${Key.sk}`],
        }),
      };
    },
  };
};

exports.createMockDocumentClient = createMockDocumentClient;
