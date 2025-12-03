import {
  consolidateWorkQueueItems,
  sortMemberCases,
} from './consolidateWorkQueueItemsOutboxHelper';

describe('consolidateWorkQueueItems', () => {
  it('should group items by lead docket number', () => {
    const workQueue = [
      {
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        docketEntry: { documentType: 'Petition' },
      },
      {
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        docketEntry: { documentType: 'Petition' },
      },
    ];

    const result = consolidateWorkQueueItems(workQueue);

    expect(result.length).toBe(1);
    expect(result[0].groupLead).toBe('100-20');
  });

  it('should group items by document title within each lead group', () => {
    const workQueue = [
      {
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        docketEntry: { documentType: 'Petition' },
      },
      {
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        docketEntry: { documentType: 'Motion' },
      },
    ];

    const result = consolidateWorkQueueItems(workQueue);

    expect(result.length).toBe(2);
    expect(result[0].docGroup.key).toBe('Petition');
    expect(result[1].docGroup.key).toBe('Motion');
  });

  it('should use docketNumber as lead if leadDocketNumber is not present', () => {
    const workQueue = [
      {
        docketNumber: '100-20',
        docketEntry: { documentType: 'Petition' },
      },
    ];

    const result = consolidateWorkQueueItems(workQueue);

    expect(result[0].groupLead).toBe('100-20');
  });

  it('should deduplicate member cases', () => {
    const workQueue = [
      {
        docketNumber: '100-20',
        docketNumberWithSuffix: '100-20',
        leadDocketNumber: '100-20',
        docketEntry: { documentType: 'Petition' },
        groupedCases: [
          { docketNumber: '100-20', docketNumberWithSuffix: '100-20' },
          { docketNumber: '101-20', docketNumberWithSuffix: '101-20' },
          { docketNumber: '101-20', docketNumberWithSuffix: '101-20' },
        ],
      },
    ];

    const result = consolidateWorkQueueItems(workQueue);

    expect(result[0].memberCasesUnique.length).toBe(2);
  });

  it('should handle empty work queue', () => {
    const result = consolidateWorkQueueItems([]);

    expect(result).toEqual([]);
  });
});

describe('sortMemberCases', () => {
  it('should sort lead case first', () => {
    const cases = [
      { docketNumber: '102-20', inLeadCase: false },
      { docketNumber: '100-20', inLeadCase: true },
      { docketNumber: '101-20', inLeadCase: false },
    ];

    const result = sortMemberCases(cases);

    expect(result[0].docketNumber).toBe('100-20');
    expect(result[0].inLeadCase).toBe(true);
  });

  it('should sort by docket number ascending', () => {
    const cases = [
      { docketNumber: '103-20' },
      { docketNumber: '101-20' },
      { docketNumber: '102-20' },
    ];

    const result = sortMemberCases(cases);

    expect(result[0].docketNumber).toBe('101-20');
    expect(result[1].docketNumber).toBe('102-20');
    expect(result[2].docketNumber).toBe('103-20');
  });

  it('should sort by year suffix when numbers are equal', () => {
    const cases = [
      { docketNumber: '100-22' },
      { docketNumber: '100-20' },
      { docketNumber: '100-21' },
    ];

    const result = sortMemberCases(cases);

    expect(result[0].docketNumber).toBe('100-20');
    expect(result[1].docketNumber).toBe('100-21');
    expect(result[2].docketNumber).toBe('100-22');
  });

  it('should handle empty array', () => {
    const result = sortMemberCases([]);

    expect(result).toEqual([]);
  });
});
