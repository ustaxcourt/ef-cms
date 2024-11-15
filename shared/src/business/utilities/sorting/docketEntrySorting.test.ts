import {
  DOCKET_ENTRY_SORT_FIELDS,
  sortDocketEntries,
} from '@shared/business/utilities/sorting/docketEntrySorting';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { cloneDeep } from 'lodash';

describe('sortDocketEntries', () => {
  const mockDocketEntry = {
    ...MOCK_DOCUMENTS[0],
    createdAtFormatted: '2019-08-04T00:10:02.000Z',
  };

  // following dates selected to ensure test coverage of 'dateStringsCompared'
  const docketEntriesUnsorted = [
    {
      ...mockDocketEntry,
      filingDate: '2019-07-08',
      index: 2,
    },
    {
      ...mockDocketEntry,
      filingDate: '2019-08-03T00:06:44.000Z',
      index: 1,
    },
    {
      ...mockDocketEntry,
      filingDate: '2019-07-08T00:01:19.000Z',
      index: 4,
    },
    {
      ...mockDocketEntry,
      filingDate: '2017-01-01T00:01:02.025Z',
      index: 3,
    },
    {
      ...mockDocketEntry,
      filingDate: '2017-01-01T00:01:12.025Z',
      index: 5,
    },
  ];

  it('should return empty array if nothing is passed in', () => {
    const result = sortDocketEntries({ docketEntries: [] });

    expect(result).toEqual([]);
  });

  describe('sorting by filing date', () => {
    const expectedAscending = [
      {
        ...mockDocketEntry,
        filingDate: '2017-01-01T00:01:02.025Z',
        index: 3,
      },
      {
        ...mockDocketEntry,
        filingDate: '2017-01-01T00:01:12.025Z',
        index: 5,
      },
      {
        ...mockDocketEntry,
        filingDate: '2019-07-08T00:01:19.000Z',
        index: 4,
      },
      {
        ...mockDocketEntry,
        filingDate: '2019-07-08', // Since it has no timezone, it is converted to Eastern offset, and therefore before 2019-07-08T00:01:19.000Z
        index: 2,
      },
      {
        ...mockDocketEntry,
        filingDate: '2019-08-03T00:06:44.000Z',
        index: 1,
      },
    ];

    it.each([true, false, undefined])(
      'should sort docket records by date by default, and ascending unless otherwise specified (ascending: %s)',
      ascending => {
        const expected = cloneDeep(expectedAscending);
        if (ascending === false) {
          expected.reverse();
        }
        const result = sortDocketEntries({
          ascending,
          docketEntries: docketEntriesUnsorted,
        });

        expect(result).toMatchObject(expected);
      },
    );
  });

  describe('sorting by index', () => {
    const expectedAscending = [
      {
        ...mockDocketEntry,
        filingDate: '2019-08-03T00:06:44.000Z',
        index: 1,
      },
      {
        ...mockDocketEntry,
        filingDate: '2019-07-08',
        index: 2,
      },
      {
        ...mockDocketEntry,
        filingDate: '2017-01-01T00:01:02.025Z',
        index: 3,
      },
      {
        ...mockDocketEntry,
        filingDate: '2019-07-08T00:01:19.000Z',
        index: 4,
      },
      {
        ...mockDocketEntry,
        filingDate: '2017-01-01T00:01:12.025Z',
        index: 5,
      },
    ];

    it.each([true, false, undefined])(
      'should sort docket records by index when specified, and ascending unless otherwise specified (ascending: %s)',
      ascending => {
        const expected = cloneDeep(expectedAscending);
        if (ascending === false) {
          expected.reverse();
        }
        const result = sortDocketEntries({
          ascending,
          docketEntries: docketEntriesUnsorted,
          sortByField: DOCKET_ENTRY_SORT_FIELDS.index,
        });

        expect(result).toMatchObject(expected);
      },
    );
  });

  describe('sorting by date and then index', () => {
    it('should sort items by index when item calendar dates match', () => {
      const result = sortDocketEntries({
        docketEntries: [
          {
            ...mockDocketEntry,
            filingDate: '2019-08-03T00:10:02.000Z', // 8/2 @ 8:10:02PM EST
            index: 2,
          },
          {
            ...mockDocketEntry,
            filingDate: '2019-08-03T00:10:00.000Z', // 8/2 @ 8:10:00PM EST
            index: 1,
          },
          {
            ...mockDocketEntry,
            filingDate: '2019-08-03T02:06:10.000Z', // 8/2 @ 10:10:00PM EST
            index: 4,
          },
          {
            ...mockDocketEntry,
            filingDate: '2019-08-03T06:06:44.000Z', // 8/3 @ 2:10:02AM EST
            index: 3,
          },
          {
            ...mockDocketEntry,
            filingDate: '2019-09-01T00:01:12.025Z', // 8/31 @ 8:01:12AM EST
            index: 5,
          },
        ],
        sortByField: DOCKET_ENTRY_SORT_FIELDS.filingDate,
      });

      expect(result[0].index).toEqual(1);
      expect(result).toMatchObject([
        {
          index: 1,
        },
        {
          index: 2,
        },
        {
          index: 4,
        },
        {
          index: 3,
        },
        {
          index: 5,
        },
      ]);
    });
  });

  describe('sorting with entries that have no filingDate (based on createdAtFormatted)', () => {
    it.each([
      [true, 'top'],
      [false, 'bottom'],
      [undefined, 'top'],
    ])(
      'should sort items that do not display a filingDate (based on createdAtFormatted) with ascending=%s at the %s',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (ascending, _) => {
        const result = sortDocketEntries({
          ascending,
          docketEntries: [
            {
              ...mockDocketEntry,
              createdAtFormatted: '2019-08-04T00:10:02.000Z',
              index: 2,
            },
            {
              ...mockDocketEntry,
              createdAtFormatted: undefined,
            },
            {
              ...mockDocketEntry,
              createdAtFormatted: '2019-08-03T00:10:02.000Z',
              index: 1,
            },
            {
              ...mockDocketEntry,
              createdAtFormatted: undefined,
            },
          ],
          sortByField: DOCKET_ENTRY_SORT_FIELDS.index,
        });

        const expectedAscending = [
          {
            ...mockDocketEntry,
            createdAtFormatted: undefined,
          },
          {
            ...mockDocketEntry,
            createdAtFormatted: undefined,
          },
          {
            ...mockDocketEntry,
            createdAtFormatted: '2019-08-03T00:10:02.000Z',
            index: 1,
          },
          {
            ...mockDocketEntry,
            createdAtFormatted: '2019-08-04T00:10:02.000Z',
            index: 2,
          },
        ];

        expect(result).toEqual(
          ascending !== false ? expectedAscending : expectedAscending.reverse(),
        );
      },
    );
  });
});
