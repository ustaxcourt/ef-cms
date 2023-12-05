/* eslint-disable max-lines */
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  applyFiltersToCompletedMessages,
  applyFiltersToMessages,
  getFormattedMessages,
  sortCompletedMessages,
  sortFormattedMessages,
} from './processFormattedMessages';

describe('processFormattedMessages', () => {
  const DOCKET_NUMBER_1 = '101-19';
  const DOCKET_NUMBER_2 = '101-20';
  const DOCKET_NUMBER_3 = '105-20';
  const PARENT_MESSAGE_ID = '078ffe53-23ed-4386-9cc5-d7a175f5c948';

  const QUALIFIED_SORT_FIELDS = ['createdAt', 'completedAt', 'subject'];

  const {
    ASCENDING,
    CASE_SERVICES_SUPERVISOR_SECTION,
    DESCENDING,
    DOCKET_SECTION,
    PETITIONS_SECTION,
  } = applicationContext.getConstants();

  const mockMessage = {
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

  let messages;

  describe('sortFormattedMessages', () => {
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
    it('should format from section for CASE_SERVICES_SUPERVISOR_SECTION', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [
          { ...mockMessage, fromSection: CASE_SERVICES_SUPERVISOR_SECTION },
        ],
      });

      expect(result.messages[0].fromSectionFormatted).toEqual('Case Services');
    });

    it('should not format from section for non-CASE_SERVICES_SUPERVISOR_SECTION', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [{ ...mockMessage, fromSection: DOCKET_SECTION }],
      });

      expect(result.messages[0].fromSectionFormatted).toEqual(DOCKET_SECTION);
    });

    it('returns formatted date strings', () => {
      const result = getFormattedMessages({
        applicationContext,
        messages: [mockMessage],
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
          completedAtFormatted: '',
          consolidatedIconTooltipText: '',
          createdAt: '2019-01-01T16:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          inConsolidatedGroup: false,
          isLeadCase: false,
          message: 'This is a test message one',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
          shouldIndent: false,
        },
        {
          completedAtFormatted: '',
          consolidatedIconTooltipText: '',
          createdAt: '2019-01-01T17:29:13.122Z',
          createdAtFormatted: '01/01/19',
          docketNumber: '101-20',
          inConsolidatedGroup: false,
          isLeadCase: false,
          message: 'This is a test message three',
          messageDetailLink: `/messages/101-20/message-detail/${PARENT_MESSAGE_ID}`,
          parentMessageId: PARENT_MESSAGE_ID,
          shouldIndent: false,
        },
      ]);
    });

    describe('inConsolidatedGroup', () => {
      it('should be true when message.leadDocketNumber is defined', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...mockMessage,
              leadDocketNumber: '123-45',
            },
          ],
        });

        expect(result.messages[0].inConsolidatedGroup).toBeTruthy();
      });

      it('should be false when message.leadDocketNumber is undefined', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [{ ...mockMessage, leadDocketNumber: undefined }],
        });

        expect(result.messages[0].inConsolidatedGroup).toBeFalsy();
      });
    });

    describe('leadCase', () => {
      it('returns leadCase true when message.leadDocketNumber is the same as message.docketNumber', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...mockMessage,
              docketNumber: '123-45',
              leadDocketNumber: '123-45',
            },
          ],
        });

        expect(result.messages[0].isLeadCase).toBeTruthy();
      });

      it('returns leadCase false when message.leadDocketNumber is NOT the same as message.docketNumber', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...mockMessage,
              docketNumber: '123-45',
              leadDocketNumber: '999-99',
            },
          ],
        });

        expect(result.messages[0].isLeadCase).toBeFalsy();
      });
    });

    describe('consolidatedIconTooltipText', () => {
      it('should be set to "Lead case" when it is the lead case in a consolidated group', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...mockMessage,
              docketNumber: '123-45',
              leadDocketNumber: '123-45',
            },
          ],
        });

        expect(result.messages[0].consolidatedIconTooltipText).toEqual(
          'Lead case',
        );
      });

      it('should be set to "Consolidated case" when it is in a consolidated group', () => {
        const result = getFormattedMessages({
          applicationContext,
          messages: [
            {
              ...mockMessage,
              docketNumber: '123-45',
              leadDocketNumber: '443-45',
            },
          ],
        });

        expect(result.messages[0].consolidatedIconTooltipText).toEqual(
          'Consolidated case',
        );
      });
    });
  });

  describe('applyFiltersToCompletedMessages', () => {
    it('returns only messages for the rick user when filtering by completedBy "rick"', () => {
      const result = applyFiltersToCompletedMessages({
        completedMessages: [
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'rick',
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
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'bob',
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
        screenMetadata: {
          completedBy: 'rick',
        },
      });

      expect(result.filteredCompletedMessages.length).toEqual(1);
      expect(result.filterValues.completedByUsers).toEqual(['rick']);
    });

    it('should sort the completed by filter options alphabetically by default', () => {
      const result = applyFiltersToCompletedMessages({
        completedMessages: [
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'rick',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: PETITIONS_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
          {
            caseStatus: 'Closed',
            completedAt: '2009-05-01T17:29:13.122Z',
            completedBy: 'stacey',
            createdAt: '2008-01-01T17:29:13.122Z',
            docketNumber: '999-45',
            docketNumberSuffix: '',
            from: 'Test Sender 2',
            fromSection: PETITIONS_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message FOR THE AGES',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: DOCKET_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'bob',
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
            to: 'petitionsclerk',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
        screenMetadata: {},
      });

      expect(result.filterValues.completedByUsers).toEqual([
        'bob',
        'rick',
        'stacey',
      ]);
    });
  });

  describe('applyFiltersToMessages', () => {
    it('should return the one message that matches all of the selected filters set on screenMetadata', () => {
      const result = applyFiltersToMessages({
        messages: [
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'rick',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: PETITIONS_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
          {
            caseStatus: 'Ready for trial',
            completedAt: '2019-05-01T17:29:13.122Z',
            completedBy: 'bob',
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
            to: 'petitionsclerk',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
        screenMetadata: {
          caseStatus: 'Ready for trial',
          fromSection: PETITIONS_SECTION,
          fromUser: 'Test Sender',
          toSection: PETITIONS_SECTION,
          toUser: 'Test Recipient',
        },
      });

      expect(result.filteredMessages.length).toEqual(1);
      expect(result.filterValues.caseStatuses).toEqual(['Ready for trial']);
      expect(result.filterValues.fromSections).toEqual([PETITIONS_SECTION]);
      expect(result.filterValues.fromUsers).toEqual(['Test Sender']);
      expect(result.filterValues.toSections).toEqual([PETITIONS_SECTION]);
      expect(result.filterValues.toUsers).toEqual(['Test Recipient']);
    });

    it('should sort all the filters alphabetically by default', () => {
      const result = applyFiltersToMessages({
        messages: [
          {
            caseStatus: 'Ready for trial',
            createdAt: '2019-01-01T17:29:13.122Z',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            from: 'Test Sender',
            fromSection: PETITIONS_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
          {
            caseStatus: 'Closed',
            createdAt: '2008-01-01T17:29:13.122Z',
            docketNumber: '999-45',
            docketNumberSuffix: '',
            from: 'Test Sender 2',
            fromSection: PETITIONS_SECTION,
            fromUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3859',
            message: 'This is a test message FOR THE AGES',
            messageId: '22281f4d-1e47-423a-8caf-6d2fdc3d3859',
            parentMessageId: PARENT_MESSAGE_ID,
            subject: 'Test subject...',
            to: 'Test Recipient',
            toSection: DOCKET_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
          {
            caseStatus: 'Ready for trial',
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
            to: 'petitionsclerk',
            toSection: PETITIONS_SECTION,
            toUserId: '33331f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
        screenMetadata: {},
      });

      expect(result.filterValues.caseStatuses).toEqual([
        'Closed',
        'Ready for trial',
      ]);
      expect(result.filterValues.fromSections).toEqual([
        DOCKET_SECTION,
        PETITIONS_SECTION,
      ]);
      expect(result.filterValues.fromUsers).toEqual([
        'Test Sender',
        'Test Sender 2',
      ]);
      expect(result.filterValues.toSections).toEqual([
        DOCKET_SECTION,
        PETITIONS_SECTION,
      ]);
      expect(result.filterValues.toUsers).toEqual([
        'Test Recipient',
        'petitionsclerk',
      ]);
    });
  });
});
