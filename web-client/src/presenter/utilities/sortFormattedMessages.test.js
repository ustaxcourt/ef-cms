import { sortFormattedMessages } from './sortFormattedMessages';

describe('sortFormattedMessages', () => {
  const unsortedMessages = [
    {
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-19',
      message: 'This is a test message on 2019-01-01T16:29:13.122Z',
      subject: 'AAAA',
    },
    {
      completedAt: '2019-01-03T17:29:13.122Z',
      createdAt: '2019-01-02T17:29:13.122Z',
      docketNumber: '103-20',
      message: 'This is a test message on 2019-01-02T17:29:13.122Z',
      subject: 'CCCC',
    },
    {
      completedAt: '2019-01-02T17:29:13.122Z',
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '102-20',
      message: 'This is a test message on 2019-01-01T17:29:13.122Z',
      subject: 'BBBB',
    },
  ];

  const QUALIFIED_SORT_FIELDS = ['createdAt', 'completedAt', 'subject'];

  it('should not sort the messages if sortField is not a qualified sortable field', () => {
    const result = sortFormattedMessages(unsortedMessages, {
      sortField: 'unqualifiedSortField',
    });

    expect(result).toEqual(unsortedMessages);
  });

  it('sorts messages by createdAt when there is no tableSort configuration', () => {
    const result = sortFormattedMessages(unsortedMessages);

    expect(result).toMatchObject([
      {
        createdAt: '2019-01-01T16:29:13.122Z',
        docketNumber: '101-19',
      },
      {
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: '102-20',
      },
      {
        createdAt: '2019-01-02T17:29:13.122Z',
        docketNumber: '103-20',
      },
    ]);
  });

  QUALIFIED_SORT_FIELDS.forEach(sortField => {
    it(`should sort unsortedMessages based on ${sortField}`, () => {
      const result = sortFormattedMessages(unsortedMessages, {
        sortField,
      });

      expect(result).toMatchObject([
        {
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-19',
        },
        {
          completedAt: '2019-01-02T17:29:13.122Z',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '102-20',
        },
        {
          completedAt: '2019-01-03T17:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '103-20',
        },
      ]);
    });
  });

  it('should sort docketNumber chronologically', () => {
    const result = sortFormattedMessages(unsortedMessages, {
      sortField: 'docketNumber',
    });

    expect(result).toMatchObject([
      {
        createdAt: '2019-01-01T16:29:13.122Z',
        docketNumber: '101-19',
      },
      {
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: '102-20',
      },
      {
        createdAt: '2019-01-02T17:29:13.122Z',
        docketNumber: '103-20',
      },
    ]);
  });

  it('should reverse the sorted order or messages if sortOrder is descending', () => {
    const result = sortFormattedMessages(unsortedMessages, {
      sortOrder: 'desc',
    });

    expect(result).toMatchObject([
      {
        createdAt: '2019-01-02T17:29:13.122Z',
        docketNumber: '103-20',
      },
      {
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: '102-20',
      },
      {
        createdAt: '2019-01-01T16:29:13.122Z',
        docketNumber: '101-19',
      },
    ]);
  });
});
