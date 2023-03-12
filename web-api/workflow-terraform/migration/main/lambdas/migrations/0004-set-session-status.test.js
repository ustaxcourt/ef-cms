import { migrateItems } from './0004-set-session-status';

describe('migrateItems', () => {
  const mockSession = {
    address1: '123 Main St',
    caseOrder: [],
    city: 'San Francisco',
    createdAt: '2019-10-27T05:00:00.000Z',
    gsi1pk: 'trial-session-catalog',
    isCalendared: true,
    judge: {
      name: 'Ashford',
      userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
    },
    maxCases: 100,
    pk: 'trial-session|539c4338-0fac-42eb-b0eb-d53b8d0195cc',
    postalCode: '94535',
    proceedingType: 'In Person',
    sessionType: 'Hybrid',
    sk: 'trial-session|539c4338-0fac-42eb-b0eb-d53b8d0195cc',
    startDate: '2019-12-30T05:00:00.000Z',
    startTime: '10:00',
    state: 'CA',
    swingSession: false,
    term: 'Winter',
    termYear: '2020',
    trialLocation: 'San Francisco, California',
    trialSessionId: '539c4338-0fac-42eb-b0eb-d53b8d0195cc',
  };

  it('should return and not modify records that are NOT trial session working copies', async () => {
    const items = [
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to new when NOT calendared', async () => {
    const items = [
      { ...mockSession, isCalendared: false, sessionStatus: undefined },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        isCalendared: false,
        sessionStatus: 'New',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to open when calendared', async () => {
    const items = [{ ...mockSession, sessionStatus: undefined }];
    const results = await migrateItems(items);
    expect(results).toEqual([
      {
        ...mockSession,
        sessionStatus: 'Open',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to closed when isClosed it true, and delete the old isClosed value', async () => {
    const items = [{ ...mockSession, isClosed: true }];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        sessionStatus: 'Closed',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to Closed when all cases are removed from the trial session, and the case is Location-based', async () => {
    const items = [
      {
        ...mockSession,
        caseOrder: [
          {
            disposition: 'testing',
            docketNumber: '101-20',
            removedFromTrial: true,
            removedFromTrialDate: '2100-12-01T00:00:00.000Z',
          },
        ],
        isClosed: false,
        sessionScope: 'Location-based',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        caseOrder: [
          {
            disposition: 'testing',
            docketNumber: '101-20',
            removedFromTrial: true,
            removedFromTrialDate: '2100-12-01T00:00:00.000Z',
          },
        ],
        isClosed: undefined,
        sessionScope: 'Location-based',
        sessionStatus: 'Closed',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to open when all cases are removed from the trial session, and the session is standaloneRemote', async () => {
    const items = [
      {
        ...mockSession,
        caseOrder: [
          {
            disposition: 'testing',
            docketNumber: '101-20',
            removedFromTrial: true,
            removedFromTrialDate: '2100-12-01T00:00:00.000Z',
          },
        ],
        isClosed: false,
        sessionScope: 'Standalone Remote',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        caseOrder: [
          {
            disposition: 'testing',
            docketNumber: '101-20',
            removedFromTrial: true,
            removedFromTrialDate: '2100-12-01T00:00:00.000Z',
          },
        ],
        isClosed: undefined,
        sessionScope: 'Standalone Remote',
        sessionStatus: 'Open',
      },
    ]);
  });

  it('should set the session status to new if it has no cases and it is not calendared', async () => {
    const items = [
      {
        ...mockSession,
        caseOrder: undefined,
        isCalendared: false,
        sessionScope: 'Standalone Remote',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        caseOrder: undefined,
        isCalendared: false,
        isClosed: undefined,
        sessionScope: 'Standalone Remote',
        sessionStatus: 'New',
      },
    ]);
  });
});
