import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { sortPendingReportItems } from '@shared/business/utilities/pendingItem/sortPendingReportItems';

describe('sortPendingReportItems', () => {
  it('should sort the pending items by the provided sort field and order, asc', () => {
    const SORT_FIELD = 'testProp';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        testProp: 5,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 2,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 2,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 2,
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        testProp: 1,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 4,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 3,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 1,
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
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 1,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 2,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 3,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 4,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 5,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: 2,
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: 2,
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
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 2,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 2,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 2,
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        testProp: 1,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 4,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 3,
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        testProp: 7,
        receivedAt: 1,
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
        receivedAt: 2,
        sortableDocketNumber: 2,
        testProp: 7,
      },
      {
        receivedAt: 2,
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 7,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 5,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 4,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 3,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 2,
      },
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
        testProp: 1,
      },
    ]);
  });

  it('should sort using the default soting settings', () => {
    const SORT_FIELD = '';
    const SORT_ORDER = 'asc' as const;
    const PENDING_ITEMS: PendingItemFormatted[] = [
      {
        receivedAt: 8,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 3,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 2,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 2,
        sortableDocketNumber: 2,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 1,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 9,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 6,
        sortableDocketNumber: 1,
      } as unknown as PendingItemFormatted,
      {
        receivedAt: 7,
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
        receivedAt: 1,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 2,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 2,
        sortableDocketNumber: 2,
      },
      {
        receivedAt: 3,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 6,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 7,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 8,
        sortableDocketNumber: 1,
      },
      {
        receivedAt: 9,
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
});
