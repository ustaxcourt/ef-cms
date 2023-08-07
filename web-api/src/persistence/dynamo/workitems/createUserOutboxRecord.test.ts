import {
  FORMATS,
  createISODateString,
  formatDateString,
  subtractISODates,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createUserOutboxRecord } from './createUserOutboxRecord';

describe('createUserOutboxRecord', () => {
  let mockWorkItem;
  const now = createISODateString();

  describe('recent outbox records', () => {
    const week = formatDateString(now, FORMATS.WEEK);
    const year = formatDateString(now, FORMATS.YEAR);

    beforeEach(() => {
      mockWorkItem = {
        caseStatus: 'New',
        completedAt: now,
        completedMessage: 'completed',
        updatedAt: now,
        workItemId: 'work-item-id-123',
      };
    });

    it('creates a user outbox record with the completed datetime', async () => {
      await createUserOutboxRecord({
        applicationContext,
        userId: 'i-am-guy-fieri',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: 'user-outbox|i-am-guy-fieri',
          sk: mockWorkItem.completedAt,
          ttl: expect.anything(),
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `user-outbox|i-am-guy-fieri|${year}-w${week}`,
          sk: mockWorkItem.completedAt,
        },
      });
    });

    it('creates a section outbox record with the updated datetime', async () => {
      mockWorkItem = {
        ...mockWorkItem,
        completedAt: undefined,
        completedMessage: undefined,
      };

      await createUserOutboxRecord({
        applicationContext,
        userId: 'i-am-guy-fieri',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: 'user-outbox|i-am-guy-fieri',
          sk: mockWorkItem.updatedAt,
          ttl: expect.anything(),
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `user-outbox|i-am-guy-fieri|${year}-w${week}`,
          sk: mockWorkItem.updatedAt,
        },
      });
    });
  });

  describe('old outbox records', () => {
    const oneYearAgo = subtractISODates(now, { year: 1 });
    const week = formatDateString(oneYearAgo, FORMATS.WEEK);
    const year = formatDateString(oneYearAgo, FORMATS.YEAR);

    beforeEach(() => {
      mockWorkItem = {
        caseStatus: 'New',
        completedAt: formatDateString(oneYearAgo),
        completedMessage: 'completed',
        updatedAt: formatDateString(oneYearAgo),
        workItemId: 'work-item-id-123',
      };
    });

    it('creates a user outbox record with the completed datetime', async () => {
      await createUserOutboxRecord({
        applicationContext,
        userId: 'i-am-guy-fieri',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `user-outbox|i-am-guy-fieri|${year}-w${week}`,
          sk: mockWorkItem.completedAt,
        },
      });
    });

    it('creates a section outbox record with the updated datetime', async () => {
      mockWorkItem = {
        ...mockWorkItem,
        completedAt: undefined,
        completedMessage: undefined,
      };

      await createUserOutboxRecord({
        applicationContext,
        userId: 'i-am-guy-fieri',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `user-outbox|i-am-guy-fieri|${year}-w${week}`,
          sk: mockWorkItem.updatedAt,
        },
      });
    });
  });
});
