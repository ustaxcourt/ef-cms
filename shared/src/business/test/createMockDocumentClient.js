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
    query: ({ ExpressionAttributeValues }) => {
      const arr = [];
      for (let key in data) {
        const value = ExpressionAttributeValues[':pk'];
        if (key.split(' ')[0].indexOf(value) !== -1) {
          arr.push(data[key]);
        }
      }
      return {
        promise: async () => ({
          Items: arr,
        }),
      };
    },
    update: ({ Key }) => {
      let id = (data[`${Key.pk} ${Key.sk}`] || {}).id;
      data[`${Key.pk} ${Key.sk}`] = {
        id: (id || 0) + 1,
      };
      return {
        promise: async () => ({
          Attributes: data[`${Key.pk} ${Key.sk}`],
        }),
      };
    },
  };
};

exports.createMockDocumentClient = createMockDocumentClient;
