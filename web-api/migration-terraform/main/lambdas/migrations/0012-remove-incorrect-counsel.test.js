const { migrateItems } = require('./0012-remove-incorrect-counsel');

describe('migrateItems', () => {
  let documentClient;

  const MOCK_USER_ID = '92b73bda-1e30-4bb0-a611-cc55635150eb';

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT case counsel records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify records that are case privatePractitioner records with a role that matches their user record', async () => {
    const mockCasePrivatePractitionerRecord = {
      pk: 'case|101-20',
      sk: `privatePractitioner|${MOCK_USER_ID}`,
    };

    const items = [mockCasePrivatePractitionerRecord];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          pk: `user|${MOCK_USER_ID}`,
          role: 'privatePractitioner',
          sk: `user|${MOCK_USER_ID}`,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([mockCasePrivatePractitionerRecord]);
  });

  it('should NOT migrate records that are case privatePractitioner records with a role that does NOT match their user record', async () => {
    const mockCasePrivatePractitionerRecord = {
      pk: 'case|101-20',
      sk: `privatePractitioner|${MOCK_USER_ID}`,
    };

    const items = [mockCasePrivatePractitionerRecord];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          pk: `user|${MOCK_USER_ID}`,
          role: 'irsPractitioner',
          sk: `user|${MOCK_USER_ID}`,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });

  it('should return and not modify records that are case irsPractitioner records with a role that matches their user record', async () => {
    const mockCaseIrsPractitionerRecord = {
      pk: 'case|101-20',
      sk: `irsPractitioner|${MOCK_USER_ID}`,
    };

    const items = [mockCaseIrsPractitionerRecord];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          pk: `user|${MOCK_USER_ID}`,
          role: 'irsPractitioner',
          sk: `user|${MOCK_USER_ID}`,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([mockCaseIrsPractitionerRecord]);
  });

  it('should NOT migrate records that are case irsPractitioner records with a role that does NOT match their user record', async () => {
    const mockCaseIrsPractitionerRecord = {
      pk: 'case|101-20',
      sk: `irsPractitioner|${MOCK_USER_ID}`,
    };

    const items = [mockCaseIrsPractitionerRecord];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          pk: `user|${MOCK_USER_ID}`,
          role: 'privatePractitioner',
          sk: `user|${MOCK_USER_ID}`,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });
});
