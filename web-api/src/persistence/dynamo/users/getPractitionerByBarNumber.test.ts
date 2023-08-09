import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchGet, query } from '../../dynamodbClientService';
import { getPractitionerByBarNumber } from './getPractitionerByBarNumber';

const mappingRecords = [
  {
    pk: 'privatePractitioner|PT1234',
    sk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
  },
  {
    pk: 'irsPractitioner|PI5678',
    sk: 'user|0105d1ab-18d0-43ec-bafb-654e83405416',
  },
  {
    pk: 'inactivePractitioner|PI9999',
    sk: 'user|be4274f0-c525-45bc-8378-9f30fd841571',
  },
];

const privatePractitioner = {
  barNumber: 'PT1234',
  name: 'Test Practitioner',
  pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
  sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
  userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
};

const irsPractitioner = {
  barNumber: 'PI5678',
  name: 'IRS Practitioner',
  pk: 'user|0105d1ab-18d0-43ec-bafb-654e83405416',
  role: ROLES.irsPractitioner,
  section: 'irsPractitioner',
  sk: '0105d1ab-18d0-43ec-bafb-654e83405416',
  userId: '0105d1ab-18d0-43ec-bafb-654e83405416',
};

const inactivePractitioner = {
  barNumber: 'PI9999',
  name: 'Inactive Practitioner',
  pk: 'user|be4274f0-c525-45bc-8378-9f30fd841571',
  role: ROLES.inactivePractitioner,
  section: 'inactivePractitioner',
  sk: 'be4274f0-c525-45bc-8378-9f30fd841571',
  userId: 'be4274f0-c525-45bc-8378-9f30fd841571',
};

const practitionerRecords = [
  privatePractitioner,
  irsPractitioner,
  inactivePractitioner,
];

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn(),
  query: jest.fn().mockImplementation(({ ExpressionAttributeValues }) => {
    const pk = ExpressionAttributeValues[':pk'];
    return mappingRecords.filter(record => record.pk === pk);
  }),
}));
const queryMock = query as jest.Mock;
const batchGetMock = batchGet as jest.Mock;

describe('getPractitionerByBarNumber', () => {
  beforeAll(() => {
    batchGetMock.mockImplementation(({ keys }) => {
      const pkArry = keys.map(key => key.pk);
      return practitionerRecords.filter(record => pkArry.includes(record.pk));
    });
  });

  it('should convert bar number to upper case for queries', async () => {
    await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'pt1234',
    });
    expect(queryMock.mock.calls[0][0].ExpressionAttributeValues[':pk']).toEqual(
      'irsPractitioner|PT1234',
    );
    expect(queryMock.mock.calls[1][0].ExpressionAttributeValues[':pk']).toEqual(
      'privatePractitioner|PT1234',
    );
    expect(queryMock.mock.calls[2][0].ExpressionAttributeValues[':pk']).toEqual(
      'inactivePractitioner|PT1234',
    );
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

  it('should return inactivePractitioner with matching bar number', async () => {
    const result = await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'PI9999',
    });
    expect(result).toEqual(inactivePractitioner);
  });

  it('should return undefined with no matching bar number', async () => {
    const result = await getPractitionerByBarNumber({
      applicationContext,
      barNumber: 'BN0000',
    });
    expect(result).toBeUndefined();
  });
});
