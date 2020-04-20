const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { User } = require('../../../business/entities/User');

const { getPractitionerByBarNumber } = require('./getPractitionerByBarNumber');

describe('getPractitionerByBarNumber', () => {
  const privatePractitioner = {
    barNumber: 'PT1234',
    name: 'Test Practitioner',
    pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
    role: User.ROLES.privatePractitioner,
    section: 'privatePractitioner',
    sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
    userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const irsPractitioner = {
    barNumber: 'PI5678',
    name: 'IRS Practitioner',
    pk: 'user|0105d1ab-18d0-43ec-bafb-654e83405416',
    role: User.ROLES.irsPractitioner,
    section: 'irsPractitioner',
    sk: '0105d1ab-18d0-43ec-bafb-654e83405416',
    userId: '0105d1ab-18d0-43ec-bafb-654e83405416',
  };

  const practitionerRecords = [privatePractitioner, irsPractitioner];

  const mappingRecords = [
    {
      pk: 'privatePractitioner|PT1234',
      sk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      pk: 'irsPractitioner|PI5678',
      sk: 'user|0105d1ab-18d0-43ec-bafb-654e83405416',
    },
  ];

  beforeEach(() => {
    client.batchGet = jest.fn(({ keys }) => {
      const pkArry = keys.map(key => key.pk);
      return practitionerRecords.filter(record => pkArry.includes(record.pk));
    });

    client.query = jest.fn(({ ExpressionAttributeValues }) => {
      const pk = ExpressionAttributeValues[':pk'];
      return mappingRecords.filter(record => record.pk === pk);
    });
  });

  it('should convert bar number to upper case for queries', async () => {
    await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'pt1234',
    });
    expect(
      client.query.mock.calls[0][0].ExpressionAttributeValues[':pk'],
    ).toEqual('irsPractitioner|PT1234');
    expect(
      client.query.mock.calls[1][0].ExpressionAttributeValues[':pk'],
    ).toEqual('privatePractitioner|PT1234');
  });

  it('should return privatePractitioner with matching bar number', async () => {
    const result = await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'PT1234',
    });
    expect(result).toEqual(privatePractitioner);
  });

  it('should return irsPractitioner with matching bar number', async () => {
    const result = await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'PI5678',
    });
    expect(result).toEqual(irsPractitioner);
  });

  it('should return undefined with no matching bar number', async () => {
    const result = await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'BN0000',
    });
    expect(result).toBeUndefined();
  });
});
