import {
  sortCompletedMessages,
  sortFormattedMessages,
} from './processFormattedMessages';

describe('processFormattedMessages', () => {
  const DOCKET_NUMBER_1 = '101-19';
  const DOCKET_NUMBER_2 = '101-20';
  const DOCKET_NUMBER_3 = '105-20';
  const PARENT_MESSAGE_ID = '078ffe53-23ed-4386-9cc5-d7a175f5c948';

  describe('sortFormattedMessages', () => {
    const messages = [
      {
        completedAt: '2019-01-02T16:29:13.122Z',
        createdAt: '2019-01-01T16:29:13.122Z',
        docketNumber: DOCKET_NUMBER_1,
        message: 'This is a test message on 2019-01-01T16:29:13.122Z',
        parentMessageId: PARENT_MESSAGE_ID,
        subject: 'AAAA',
      },
      {
        completedAt: '2019-01-03T17:29:13.122Z',
        createdAt: '2019-01-02T17:29:13.122Z',
        docketNumber: DOCKET_NUMBER_3,
        message: 'This is a test message on 2019-01-02T17:29:13.122Z',
        parentMessageId: PARENT_MESSAGE_ID,
        subject: 'CCCC',
      },
      {
        completedAt: '2019-01-02T17:29:13.122Z',
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: DOCKET_NUMBER_2,
        message: 'This is a test message on 2019-01-01T17:29:13.122Z',
        parentMessageId: PARENT_MESSAGE_ID,
        subject: 'BBBB',
      },
    ];

    const QUALIFIED_SORT_FIELDS = ['createdAt', 'completedAt', 'subject'];

    it('should not sort the messages if sortField is not a qualified sortable field', () => {
      const result = sortFormattedMessages(messages, {
        sortField: 'unqualifiedSortField',
      });

      expect(result).toEqual(messages);
    });

    it('sorts messages by createdAt when there is no tableSort configuration or tableSort.field is undefined', () => {
      const result = sortFormattedMessages(messages);

      expect(result).toMatchObject([
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
        },
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
        },
        {
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
        },
      ]);
    });

    QUALIFIED_SORT_FIELDS.forEach(sortField => {
      it(`should sort messages based on ${sortField}`, () => {
        const result = sortFormattedMessages(messages, {
          sortField,
        });

        expect(result).toMatchObject([
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: DOCKET_NUMBER_1,
          },
          {
            completedAt: '2019-01-02T17:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: DOCKET_NUMBER_2,
          },
          {
            completedAt: '2019-01-03T17:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: DOCKET_NUMBER_3,
          },
        ]);
      });
    });

    it('should sort docketNumber chronologically by default', () => {
      const result = sortFormattedMessages(messages, {
        sortField: 'docketNumber',
      });

      expect(result).toMatchObject([
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
        },
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
        },
        {
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
        },
      ]);
    });

    it('should reverse the order of messages if sortOrder is descending', () => {
      const result = sortFormattedMessages(messages, {
        sortField: 'UNKNOWN',
        sortOrder: 'desc',
      });

      expect(result).toMatchObject([
        {
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
        },
        {
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
        },
      ]);
    });
  });

  describe('sortCompletedMessages', () => {
    const sortedMessages = [
      {
        completedAt: '2019-01-02T16:29:13.122Z',
        createdAt: '2019-01-01T16:29:13.122Z',
        docketNumber: DOCKET_NUMBER_1,
        isCompleted: true,
        message: 'This is a test message on 2019-01-01T16:29:13.122Z',
        subject: 'AAAA',
      },
      {
        completedAt: '2019-01-02T17:29:13.122Z',
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: DOCKET_NUMBER_2,
        isCompleted: false,
        message: 'This is a test message on 2019-01-01T17:29:13.122Z',
        subject: 'BBBB',
      },
      {
        completedAt: '2019-01-03T17:29:13.122Z',
        createdAt: '2019-01-02T17:29:13.122Z',
        docketNumber: DOCKET_NUMBER_3,
        isCompleted: true,
        message: 'This is a test message on 2019-01-02T17:29:13.122Z',
        subject: 'CCCC',
      },
    ];

    it('should sort completed messages and return them in descending order when there is no table sort configuration', () => {
      const result = sortCompletedMessages(sortedMessages);

      expect(result).toMatchObject([
        {
          completedAt: '2019-01-03T17:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          isCompleted: true,
          message: 'This is a test message on 2019-01-02T17:29:13.122Z',
          subject: 'CCCC',
        },
        {
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
          isCompleted: true,
          message: 'This is a test message on 2019-01-01T16:29:13.122Z',
          subject: 'AAAA',
        },
      ]);
    });

    it('should sort completed messages and return them in ascending order when there is a table sort configuration', () => {
      const result = sortCompletedMessages(sortedMessages, {
        sortField: 'irrelevent',
        sortOrder: 'irrelevent',
      });

      expect(result).toMatchObject([
        {
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: DOCKET_NUMBER_1,
          isCompleted: true,
          message: 'This is a test message on 2019-01-01T16:29:13.122Z',
          subject: 'AAAA',
        },
        {
          completedAt: '2019-01-03T17:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          isCompleted: true,
          message: 'This is a test message on 2019-01-02T17:29:13.122Z',
          subject: 'CCCC',
        },
      ]);
    });
  });
});
