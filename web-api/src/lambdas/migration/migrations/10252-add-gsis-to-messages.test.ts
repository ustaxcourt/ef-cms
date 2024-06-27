import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { RawMessage } from '@shared/business/entities/Message';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { migrateItems } from './10252-add-gsis-to-messages';

describe('migrateItems', () => {
  const gsiUserBoxKey = 'gsiUserBox';
  const gsiSectionBoxKey = 'gsiSectionBox';

  let mockMessage: TDynamoRecord<RawMessage>;
  beforeEach(() => {
    mockMessage = {
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'The Land Before Time',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '123-20',
      docketNumberWithSuffix: '123-45S',
      entityName: 'Message',
      from: 'Test Petitionsclerk',
      fromSection: PETITIONS_SECTION,
      fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
      isCompleted: false,
      isRead: false,
      isRepliedTo: false,
      message: 'hey there',
      messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
      parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
      pk: 'case|101-45',
      sk: 'message|a10d6855-f3ee-4c11-861c-c7f11cba4dff',
      subject: 'hello',
      to: 'Test Petitionsclerk2',
      toSection: PETITIONS_SECTION,
      toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
    };
  });

  describe('completed', () => {
    beforeEach(() => {
      mockMessage = {
        ...mockMessage,
        completedAt: '2024-03-01T00:00:00.000Z',
        completedBy: 'someone',
        completedBySection: 'section-name',
        completedByUserId: 'user-id',
      };
    });

    it('does not add a gsiUserBox or gsiSectionBox on a message record that has completedAt', () => {
      const migratedItems = migrateItems([mockMessage]);
      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            [gsiSectionBoxKey]: undefined,
            [gsiUserBoxKey]: undefined,
          },
        ]),
      );
    });

    it('adds a record for user completed box', () => {
      const migratedItems = migrateItems([mockMessage]);
      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            gsi1pk: undefined,
            [gsiSectionBoxKey]: undefined,
            [gsiUserBoxKey]: undefined,
            pk: 'message|completed|user|user-id',
            sk: mockMessage.completedAt,
            ttl: expect.anything(),
          },
        ]),
      );
    });

    it('adds a record for the section completed box', () => {
      const migratedItems = migrateItems([mockMessage]);
      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            gsi1pk: undefined,
            [gsiSectionBoxKey]: undefined,
            [gsiUserBoxKey]: undefined,
            pk: 'message|completed|section|section-name',
            sk: mockMessage.completedAt,
            ttl: expect.anything(),
          },
        ]),
      );
    });
  });

  describe('inbox', () => {
    it('adds gsiUserBox on a message record that has a toUserId', async () => {
      mockMessage = {
        ...mockMessage,
        completedAt: undefined,
        toUserId: '123',
      };

      const migratedItems = await migrateItems([mockMessage]);

      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            [gsiUserBoxKey]: 'assigneeId|123',
          },
        ]),
      );
    });

    it('adds gsiSectionBox on a message record that has a section', async () => {
      mockMessage = {
        ...mockMessage,
        completedAt: undefined,
        toSection: DOCKET_SECTION,
      };

      const migratedItems = await migrateItems([mockMessage]);

      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            [gsiSectionBoxKey]: `section|${DOCKET_SECTION}`,
          },
        ]),
      );
    });

    it('does not add a gsiUserBox on a message record that does not have a toUserId', async () => {
      mockMessage = {
        ...mockMessage,
        toUserId: undefined,
      } as any;
      const records = [mockMessage];

      const migratedItems = await migrateItems(records);

      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            [gsiUserBoxKey]: undefined,
          },
        ]),
      );
    });

    it('does not add a gsiSectionBox on a message record that does not have a toSection specified', async () => {
      mockMessage = {
        ...mockMessage,
        toSection: undefined,
      } as any;
      const records = [mockMessage];

      const migratedItems = await migrateItems(records);

      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            [gsiSectionBoxKey]: undefined,
          },
        ]),
      );
    });

    it('adds a record for user outbox box', () => {
      const migratedItems = migrateItems([mockMessage]);
      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            gsi1pk: undefined,
            [gsiSectionBoxKey]: undefined,
            [gsiUserBoxKey]: undefined,
            pk: 'message|outbox|user|4791e892-14ee-4ab1-8468-0c942ec379d2',
            sk: mockMessage.createdAt,
            ttl: expect.anything(),
          },
        ]),
      );
    });

    it('adds a record for the section outbox box', () => {
      const migratedItems = migrateItems([mockMessage]);
      expect(migratedItems).toEqual(
        expect.arrayContaining([
          {
            ...mockMessage,
            gsi1pk: undefined,
            [gsiSectionBoxKey]: undefined,
            [gsiUserBoxKey]: undefined,
            pk: `message|outbox|section|${PETITIONS_SECTION}`,
            sk: mockMessage.createdAt,
            ttl: expect.anything(),
          },
        ]),
      );
    });
  });
});
