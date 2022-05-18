// import { ASCENDING, DESCENDING } from '../presenterConstants';
import { sortFormattedMessages } from './sortFormattedMessages';

describe('sortFormattedMessages', () => {
  const messages = [
    {
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-19',
      message: 'This is a test message on 2019-01-01T16:29:13.122Z',
    },
    {
      createdAt: '2019-01-02T17:29:13.122Z',
      docketNumber: '103-20',
      message: 'This is a test message on 2019-01-02T17:29:13.122Z',
    },
    {
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '102-20',
      message: 'This is a test message on 2019-01-01T17:29:13.122Z',
    },
  ];

  // const QUALIFIED_SORT_FIELDS = ['createdAt', 'completedAt', 'subject'];

  it('should not sort the messages if sortField is not a qualified sortable field', () => {
    const result = sortFormattedMessages(messages, {
      sortField: 'unqualifiedSortField',
    });

    expect(result).toEqual(messages);
  });

  it('sorts messages by createdAt when there is no tableSort configuration', () => {
    const result = sortFormattedMessages(messages);

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

  // it('should sort docketNumber chronologically', () => {
  //   const result = sortFormattedMessages(messages, {
  //     sortField: 'docketNumber',
  //   });

  //   expect(result).toMatchObject([
  //     {
  //       createdAt: '2019-01-01T16:29:13.122Z',
  //       docketNumber: '101-19',
  //     },
  //     {
  //       createdAt: '2019-01-01T17:29:13.122Z',
  //       docketNumber: '102-20',
  //     },
  //     {
  //       createdAt: '2019-01-02T17:29:13.122Z',
  //       docketNumber: '103-20',
  //     },
  //   ]);
  // });

  it('should sort docketNumber chronologically', () => {
    const result = sortFormattedMessages(messages, {
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

  // QUALIFIED_SORT_FIELDS.forEach(sortField => {
  // it('', () => {});
  // });

  // it('returns messages sorted by completedAt', () => {
  //   const result = sortFormattedMessages(
  //     [
  //       {
  //         completedAt: '2019-01-03T16:29:13.122Z',
  //         createdAt: '2019-01-01T16:29:13.122Z',
  //         docketNumber: '101-20',
  //         message: 'This is a test message',
  //       },
  //       {
  //         completedAt: '2019-01-01T16:29:13.122Z',
  //         createdAt: '2019-01-02T17:29:13.122Z',
  //         docketNumber: '102-20',
  //         message: 'This is a test message',
  //       },
  //       {
  //         completedAt: '2019-01-02T16:29:13.122Z',
  //         createdAt: '2019-01-01T17:29:13.122Z',
  //         docketNumber: '103-20',
  //         message: 'This is a test message',
  //       },
  //     ],
  //     {
  //       sortField: 'completedAt',
  //     },
  //   );

  //   expect(result).toMatchObject([
  //     {
  //       completedAt: '2019-01-03T16:29:13.122Z',
  //       createdAt: '2019-01-01T16:29:13.122Z',
  //       docketNumber: '101-20',
  //       message: 'This is a test message',
  //     },
  //     {
  //       completedAt: '2019-01-02T16:29:13.122Z',
  //       createdAt: '2019-01-01T17:29:13.122Z',
  //       docketNumber: '103-20',
  //       message: 'This is a test message',
  //     },
  //     {
  //       completedAt: '2019-01-01T16:29:13.122Z',
  //       createdAt: '2019-01-02T17:29:13.122Z',
  //       docketNumber: '102-20',
  //       message: 'This is a test message',
  //     },
  //   ]);
  // });
});
