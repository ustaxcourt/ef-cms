import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { sortPendingReportItems } from '@shared/business/utilities/pendingItem/sortPendingReportItems';

describe('sortPendingReportItems', () => {
  it('should sort the pending items by the provided sort field and order, asc', () => {
    const SORT_FIELD = 'testProp';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        testProp: 5,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 2,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '2',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '2',
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        testProp: 1,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 4,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 3,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 1,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 2,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 3,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 4,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 5,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: '2',
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: '2',
        sortableDocketNumber: 2,
        testProp: 7,
      },
    ]);
  });

  it('should sort the pending items by the provided sort field and order, desc', () => {
    const SORT_FIELD = 'testProp';
    const SORT_ORDER = 'desc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        testProp: 5,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 2,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '2',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '2',
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        testProp: 1,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 4,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 3,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        receivedAt: '2',
        sortableDocketNumber: 2,
        testProp: 7,
      },
      {
        receivedAt: '2',
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 5,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 4,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 3,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 2,
      },
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
        testProp: 1,
      },
    ]);
  });

  it('should sort using the default sorting settings', () => {
    const SORT_FIELD = '';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        receivedAt: '8',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '3',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2',
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '9',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '6',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '7',
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        receivedAt: '1',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '2',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '2',
        sortableDocketNumber: 2,
      },
      {
        receivedAt: '3',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '6',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '7',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '8',
        sortableDocketNumber: 1,
      },
      {
        receivedAt: '9',
        sortableDocketNumber: 1,
      },
    ]);
  });

  it('should sort Upper/Lower case strings with same priority', () => {
    const SORT_FIELD = 'testProp';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        testProp: 'A',
      } as unknown as PendingItemFormatted,
      {
        testProp: 'C',
      } as unknown as PendingItemFormatted,
      {
        testProp: 'Bb',
      } as unknown as PendingItemFormatted,
      {
        testProp: 'ba',
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        testProp: 'A',
      },
      {
        testProp: 'ba',
      },
      {
        testProp: 'Bb',
      },
      {
        testProp: 'C',
      },
    ]);
  });

  it('should sort by docket numbers correctly', () => {
    const SORT_FIELD = 'docketNumber';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        docketNumber: '106-21',
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '105-21',
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '101-22',
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '301-20',
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        docketNumber: '301-20',
      },
      {
        docketNumber: '105-21',
      },
      {
        docketNumber: '106-21',
      },
      {
        docketNumber: '101-22',
      },
    ]);
  });

  it('should sort docket numbers in descending order and break ties with receivedAt', () => {
    const SORT_FIELD = 'docketNumber';
    const SORT_ORDER = 'desc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        docketNumber: '106-21',
        receivedAt: '2020-12-01T04:00:00.000Z',
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '106-21',
        receivedAt: '2020-11-10T04:00:00.000Z', // tie on docketNumber, earlier date
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '101-22',
        receivedAt: '2021-01-01T04:00:00.000Z',
      } as unknown as PendingItemFormatted,
      {
        docketNumber: '301-20',
        receivedAt: '2020-05-10T04:00:00.000Z',
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        docketNumber: '101-22',
        receivedAt: '2021-01-01T04:00:00.000Z',
      },
      {
        docketNumber: '106-21',
        receivedAt: '2020-12-01T04:00:00.000Z',
      },
      {
        docketNumber: '106-21',
        receivedAt: '2020-11-10T04:00:00.000Z',
      },
      {
        docketNumber: '301-20',
        receivedAt: '2020-05-10T04:00:00.000Z',
      },
    ]);
  });

  it('should fall back to default receivedAt sorting if pendingItemSortOrder is undefined', () => {
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        receivedAt: '2021-06-10T12:00:00.000Z',
        testProp: 2,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2020-01-01T00:00:00.000Z',
        testProp: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2022-03-04T08:00:00.000Z',
        testProp: 3,
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      'testProp',
      undefined,
    );

    expect(results).toEqual([
      {
        receivedAt: '2020-01-01T00:00:00.000Z',
        testProp: 1,
      },
      {
        receivedAt: '2021-06-10T12:00:00.000Z',
        testProp: 2,
      },
      {
        receivedAt: '2022-03-04T08:00:00.000Z',
        testProp: 3,
      },
    ]);
  });

  it('should break ties using receivedAt when two items have the same numeric field value', () => {
    const SORT_FIELD = 'testProp';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        receivedAt: '2022-02-10T00:00:00.000Z',
        testProp: 7,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2022-02-01T00:00:00.000Z',
        testProp: 7,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: '2020-01-01T00:00:00.000Z',
        testProp: 1,
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        receivedAt: '2020-01-01T00:00:00.000Z',
        testProp: 1,
      },
      {
        receivedAt: '2022-02-01T00:00:00.000Z',
        testProp: 7,
      },
      {
        receivedAt: '2022-02-10T00:00:00.000Z',
        testProp: 7,
      },
    ]);
  });

  it('should handle non-string, non-number fields by sorting them like numbers or objects and then by receivedAt', () => {
    const SORT_FIELD = 'isUrgent';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        isUrgent: false,
        receivedAt: '2020-01-01T00:00:00.000Z',
      } as unknown as PendingItemFormatted,
      {
        isUrgent: true,
        receivedAt: '2020-06-10T00:00:00.000Z',
      } as unknown as PendingItemFormatted,
      {
        isUrgent: true,
        receivedAt: '2020-02-15T00:00:00.000Z',
      } as unknown as PendingItemFormatted,
    ];

    const results = sortPendingReportItems(
      PENDING_ITEMS,
      SORT_FIELD,
      SORT_ORDER,
    );

    expect(results).toEqual([
      {
        isUrgent: false,
        receivedAt: '2020-01-01T00:00:00.000Z',
      },
      {
        isUrgent: true,
        receivedAt: '2020-02-15T00:00:00.000Z',
      },
      {
        isUrgent: true,
        receivedAt: '2020-06-10T00:00:00.000Z',
      },
    ]);
  });
});
