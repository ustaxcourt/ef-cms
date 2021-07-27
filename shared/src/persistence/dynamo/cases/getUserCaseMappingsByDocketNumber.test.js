const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getUserCaseMappingsByDocketNumber,
} = require('./getUserCaseMappingsByDocketNumber');

describe('getUserCaseMappingsByDocketNumber', () => {
  const docketNumber = '102-19';

  beforeEach(() => {
    client.query = jest.fn().mockReturnValueOnce([
      {
        gsi1pk: `user-case|${docketNumber}`,
      },
    ]);
  });

  it('should return docket numbers from persistence', async () => {
    const result = await getUserCaseMappingsByDocketNumber({
      applicationContext,
      docketNumber,
    });

    expect(result).toEqual({
      caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber,
      docketNumberWithSuffix: '102-19P',
      entityName: 'UserCase',
      gsi1pk: 'user-case|102-19',
      pk: 'user|7805d1ab-18d0-43ec-bafb-654e83405416',
      sk: 'case|102-19',
      status: 'New',
    });
  });
});
