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

  it('should set the trial-session sessionStatus to new when NOT calendared', async () => {
    const items = [{ ...mockSession, isCalendared: false }];
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
    const items = [mockSession];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        sessionStatus: 'Open',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to closed when isClosed it true', async () => {
    const items = [{ ...mockSession, isClosed: true }];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockSession,
        isClosed: true,
        sessionStatus: 'Closed',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to open when all cases removed from the trial session and not standaloneRemote', async () => {
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
        isClosed: false,
        sessionScope: 'Location-based',
        sessionStatus: 'Closed',
      },
    ]);
  });

  it('should set the trial-session sessionStatus to open when all cases removed from the trial session and is standaloneRemote', async () => {
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
        isClosed: false,
        sessionScope: 'Standalone Remote',
        sessionStatus: 'Open',
      },
    ]);
  });
});
