import { ASCENDING, DESCENDING } from '../presenterConstants';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  getFormattedMessages,
  sortCompletedMessages,
  sortFormattedMessages,
} from './processFormattedMessages';

describe('processFormattedMessages', () => {
  const DOCKET_NUMBER_1 = '101-19';
  const DOCKET_NUMBER_2 = '101-20';
  const DOCKET_NUMBER_3 = '105-20';
  const PARENT_MESSAGE_ID = '078ffe53-23ed-4386-9cc5-d7a175f5c948';

  describe('sortFormattedMessages', () => {
    let messages;

    beforeEach(() => {
      messages = [
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
    });

    const QUALIFIED_SORT_FIELDS = ['createdAt', 'completedAt', 'subject'];

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
      it(`should sort messages in ascending order based on ${sortField}`, () => {
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

    QUALIFIED_SORT_FIELDS.forEach(sortField => {
      it(`should sort messages in descending order based on ${sortField}`, () => {
        const result = sortFormattedMessages(messages, {
          sortField,
          sortOrder: DESCENDING,
        });

        expect(result).toMatchObject([
          {
            completedAt: '2019-01-03T17:29:13.122Z',
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: DOCKET_NUMBER_3,
          },
          {
            completedAt: '2019-01-02T17:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: DOCKET_NUMBER_2,
          },
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: DOCKET_NUMBER_1,
          },
        ]);
      });
    });

    it('should sort docketNumber oldest to newest by default', () => {
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

    it('should sort docketNumber newest to oldest if sortOrder is set to descending', () => {
      const result = sortFormattedMessages(messages, {
        sortField: 'docketNumber',
        sortOrder: DESCENDING,
      });

      expect(result).toMatchObject([
        {
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
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

    it('should reverse the order of messages if sortOrder is descending', () => {
      const result = sortFormattedMessages(messages, {
        sortField: 'UNKNOWN',
        sortOrder: DESCENDING,
      });

      expect(result).toMatchObject([
        {
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_2,
        },
        {
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: DOCKET_NUMBER_3,
          parentMessageId: PARENT_MESSAGE_ID,
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

    it('should only filter for and return completed messages when there is a table sort configuration', () => {
      const result = sortCompletedMessages(sortedMessages, {
        sortField: 'docketNumber',
        sortOrder: ASCENDING,
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

  describe('getFormattedMessages', () => {
    let validMessage;

    beforeEach(() => {
      validMessage = {
        caseStatus: 'Ready for trial',
        completedAt: '2019-05-01T17:29:13.122Z',
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: '123-45',
        docketNumberSuffix: '',
        from: 'Test Sender',
        fromSection: DOCKET_SECTION,
        fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'This is a test message',
        messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
        parentMessageId: PARENT_MESSAGE_ID,
        subject: 'Test subject...',
        to: 'Test Recipient',
        toSection: PETITIONS_SECTION,
        toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
      };
    });

    it('returns formatted date strings', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [validMessage],
      });

      expect(result.messages[0].createdAtFormatted).toEqual('01/01/19');
      expect(result.messages[0].completedAtFormatted).toEqual('05/01/19');
    });

    it('returns message detail link', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: DOCKET_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
      });

      expect(result.messages[0].messageDetailLink).toEqual(
        `/messages/123-45/message-detail/${PARENT_MESSAGE_ID}`,
      );
    });

    it('returns completedMessages in descending order of completedAt', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            // completed third
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-01T16:29:13.122Z',
            // completed first
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '102-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            completedAt: '2019-01-02T16:29:13.122Z',
            // completed second
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '103-20',
            isCompleted: true,
            message: 'This is a test message',
          },
        ],
      });

      expect(result.completedMessages).toMatchObject([
        {
          completedAt: '2019-01-03T16:29:13.122Z',
          createdAt: '2019-01-01T16:29:13.122Z',
          docketNumber: '101-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-02T16:29:13.122Z',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '103-20',
          isCompleted: true,
          message: 'This is a test message',
        },
        {
          completedAt: '2019-01-01T16:29:13.122Z',
          createdAt: '2019-01-02T17:29:13.122Z',
          docketNumber: '102-20',
          isCompleted: true,
          message: 'This is a test message',
        },
      ]);
    });

    it('returns inProgressMessages from the given messages', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          {
            createdAt: '2019-01-01T16:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message one',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-02T17:29:13.122Z',
            docketNumber: '101-20',
            isRepliedTo: true,
            message: 'This is a test message two',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '101-20',
            message: 'This is a test message three',
            parentMessageId: PARENT_MESSAGE_ID,
          },
          {
            completedAt: '2019-01-03T16:29:13.122Z',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '101-20',
            isCompleted: true,
            message: 'This is a test message four',
            parentMessageId: PARENT_MESSAGE_ID,
          },
        ],
      });

      expect(result.inProgressMessages).toEqual([
        {
          completedAtFormatted: undefined,
          createdAt: '2019-01-01T16:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          inConsolidatedGroup: false,
          inLeadCase: false,
          message: 'This is a test message one',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
        },
        {
          completedAtFormatted: undefined,
          createdAt: '2019-01-01T17:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          inConsolidatedGroup: false,
          inLeadCase: false,
          message: 'This is a test message three',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
        },
      ]);
    });

    describe('consolidation status', () => {
      const baseMessage = {
        caseStatus: 'Ready for trial',
        completedAt: '2019-05-01T17:29:13.122Z',
        createdAt: '2019-01-01T17:29:13.122Z',
        docketNumber: '123-45',
        docketNumberSuffix: '',
        from: 'Test Sender',
        fromSection: DOCKET_SECTION,
        fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'This is a test message',
        messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
        parentMessageId: PARENT_MESSAGE_ID,
        subject: 'Test subject...',
        to: 'Test Recipient',
        toSection: PETITIONS_SECTION,
        toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
      };

      it('returns inConsolidatedGroup true when message.leadDocketNumber is defined', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...baseMessage,
              leadDocketNumber: '123-45',
            },
          ],
        });

        expect(result.messages[0].inConsolidatedGroup).toBeTruthy();
      });

      it('returns inConsolidatedGroup false when message.leadDocketNumber is undefined', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [{ ...baseMessage, leadDocketNumber: undefined }],
        });

        expect(result.messages[0].inConsolidatedGroup).toBeFalsy();
      });

      it('returns inLeadCase true when message.leadDocketNumber is the same as message.docketNumber', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...baseMessage,
              docketNumber: '123-45',
              leadDocketNumber: '123-45',
            },
          ],
        });

        expect(result.messages[0].inLeadCase).toBeTruthy();
      });

      it('returns inLeadCase false when message.leadDocketNumber is NOT the same as message.docketNumber', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...baseMessage,
              docketNumber: '123-45',
              leadDocketNumber: '999-99',
            },
          ],
        });

        expect(result.messages[0].inLeadCase).toBeFalsy();
      });
    });
  });
});
