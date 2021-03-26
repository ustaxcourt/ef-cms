const {
  migrateItems,
} = require('./0024-docket-entry-docket-number-served-parties-code');
const {
  ROLES,
  SERVED_PARTIES_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

describe('migrateItems', () => {
  let mockDocketEntry;
  beforeEach(() => {
    mockDocketEntry = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Order that case is assigned to [Judge name] [Anything]',
      documentType: 'Order that case is assigned',
      eventCode: 'OAJ',
      filedBy: 'Test Petitioner',
      filingDate: '2018-03-01T00:01:00.000Z',
      freeText: 'Cheese fries',
      index: 1,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: 'Fieri',
      processingStatus: 'complete',
      scenario: 'Type B',
      signedAt: '2018-03-01T00:01:00.000Z',
      signedByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'Judge Guy Fieri',
      sk: 'docket-entry|c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };
  });

  it('should return and not modify records that are NOT docket entries', async () => {
    const items = [
      {
        ...mockDocketEntry,
        pk: 'case|000-00',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        pk: 'case|000-00',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not modify the docketNumber field on records that already have a docketNumber field', async () => {
    const items = [
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|000-00', // the pk is intentionally not matching the docket number to prove it does not get changed
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|000-00',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not modify the servedPartiesCode field on records that do not have servedParties', async () => {
    const items = [
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        servedParties: undefined,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not modify the servedPartiesCode field on records that have servedParties and a servedPartiesCode already set', async () => {
    const items = [
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        servedAt: '2018-11-21T20:49:28.192Z',
        servedParties: [{ name: 'Test Petitioner', role: ROLES.petitioner }],
        servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        servedAt: '2018-11-21T20:49:28.192Z',
        servedParties: [{ name: 'Test Petitioner', role: ROLES.petitioner }],
        servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should set the docketNumber on the given item if it does not exist', async () => {
    const items = [
      {
        ...mockDocketEntry,
        pk: 'case|123-45',
        servedParties: undefined,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should set the servedPartiesCode on the given item if there are servedParties but no servedPartiesCode', async () => {
    const items = [
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        servedAt: '2018-11-21T20:49:28.192Z',
        servedParties: [{ name: 'IRS Superuser', role: ROLES.irsSuperuser }],
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        docketNumber: '123-45',
        pk: 'case|123-45',
        servedAt: '2018-11-21T20:49:28.192Z',
        servedParties: [{ name: 'IRS Superuser', role: ROLES.irsSuperuser }],
        servedPartiesCode: SERVED_PARTIES_CODES.RESPONDENT,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });
});
