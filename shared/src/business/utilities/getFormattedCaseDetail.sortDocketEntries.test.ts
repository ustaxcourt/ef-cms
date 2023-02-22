const {
  applicationContext,
} = require('../../../../web-client/src/applicationContext');
const { sortDocketEntries } = require('./getFormattedCaseDetail');

describe('sortDocketEntries', () => {
  const getDateISO = () =>
    applicationContext.getUtilities().createISODateString();

  it('should sort docket records by date by default', () => {
    // following dates selected to ensure test coverage of 'dateStringsCompared'
    const result = sortDocketEntries(
      [
        {
          filingDate: '2019-07-08',
          index: 2,
        },
        {
          filingDate: '2019-08-03T00:06:44.000Z',
          index: 1,
        },
        {
          filingDate: '2019-07-08T00:01:19.000Z',
          index: 4,
        },
        {
          filingDate: '2017-01-01T00:01:02.025Z',
          index: 3,
        },
        {
          filingDate: '2017-01-01T00:01:12.025Z',
          index: 5,
        },
      ],
      'Desc',
    );

    expect(result[0].index).toEqual(1);
  });

  it('should sort items by index when item calendar dates match', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: '2019-08-03T00:10:02.000Z', // 8/2 @ 8:10:02PM EST
          index: 2,
        },
        {
          filingDate: '2019-08-03T00:10:00.000Z', // 8/2 @ 8:10:00PM EST
          index: 1,
        },
        {
          filingDate: '2019-08-03T02:06:10.000Z', // 8/2 @ 10:10:00PM EST
          index: 4,
        },
        {
          filingDate: '2019-08-03T06:06:44.000Z', // 8/3 @ 2:10:02AM EST
          index: 3,
        },
        {
          filingDate: '2019-09-01T00:01:12.025Z', // 8/31 @ 8:01:12AM EST
          index: 5,
        },
      ],
      'byDate',
    );

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

  it('should sort docket records by index when sortBy is byIndex', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: getDateISO(),
          index: 2,
        },
        {
          filingDate: getDateISO(),
          index: 3,
        },
        {
          filingDate: getDateISO(),
          index: 1,
        },
      ],
      'byIndex',
    );

    expect(result[1].index).toEqual(2);
  });

  it('should sort docket records in reverse if Desc is included in sortBy', () => {
    const result = sortDocketEntries(
      [
        {
          filingDate: getDateISO(),
          index: 2,
        },
        {
          filingDate: getDateISO(),
          index: 3,
        },
        {
          filingDate: getDateISO(),
          index: 1,
        },
      ],
      'byIndexDesc',
    );

    expect(result[0].index).toEqual(3);
  });

  it('should return empty array if nothing is passed in', () => {
    const result = sortDocketEntries();

    expect(result).toEqual([]);
  });

  it('should sort items that do not display a filingDate (based on createdAtFormatted) at the bottom', () => {
    const result = sortDocketEntries(
      [
        {
          createdAtFormatted: '2019-08-04T00:10:02.000Z',
          index: 2,
        },
        {
          createdAtFormatted: undefined,
        },
        {
          createdAtFormatted: '2019-08-03T00:10:02.000Z',
          index: 1,
        },
        {
          createdAtFormatted: undefined,
        },
      ],
      'byIndexDesc',
    );

    expect(result).toEqual([
      {
        createdAtFormatted: '2019-08-04T00:10:02.000Z',
        index: 2,
      },
      {
        createdAtFormatted: '2019-08-03T00:10:02.000Z',
        index: 1,
      },
      {
        createdAtFormatted: undefined,
      },
      {
        createdAtFormatted: undefined,
      },
    ]);
  });
});
