import {
  FORMATS,
  createISODateString,
  formatDateString,
  subtractISODates,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createSectionOutboxRecords } from './createSectionOutboxRecords';

describe('createSectionOutboxRecords', () => {
  let mockWorkItem;
  const now = createISODateString();

  describe('recent outbox records', () => {
    const date = formatDateString(now, FORMATS.YYYYMMDD);

    beforeEach(() => {
      mockWorkItem = {
        caseStatus: 'New',
        completedAt: now,
        completedMessage: 'completed',
        updatedAt: now,
        workItemId: 'work-item-id-123',
      };
    });

    it('creates a section outbox record with the completed datetime', async () => {
      await createSectionOutboxRecords({
        applicationContext,
        section: 'flavortown',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: 'section-outbox|flavortown',
          sk: mockWorkItem.completedAt,
          ttl: expect.anything(),
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `section-outbox|flavortown|${date}`,
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

      await createSectionOutboxRecords({
        applicationContext,
        section: 'flavortown',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: 'section-outbox|flavortown',
          sk: mockWorkItem.updatedAt,
          ttl: expect.anything(),
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `section-outbox|flavortown|${date}`,
          sk: mockWorkItem.updatedAt,
        },
      });
    });
  });

  describe('old outbox records', () => {
    const oneYearAgo = subtractISODates(now, { year: 1 });
    const date = formatDateString(oneYearAgo, FORMATS.YYYYMMDD);

    beforeEach(() => {
      mockWorkItem = {
        caseStatus: 'New',
        completedAt: formatDateString(oneYearAgo),
        completedMessage: 'completed',
        updatedAt: formatDateString(oneYearAgo),
        workItemId: 'work-item-id-123',
      };
    });

    it('creates a section outbox record with the completed datetime', async () => {
      await createSectionOutboxRecords({
        applicationContext,
        section: 'flavortown',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `section-outbox|flavortown|${date}`,
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

      await createSectionOutboxRecords({
        applicationContext,
        section: 'flavortown',
        workItem: mockWorkItem,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          gsi1pk: 'work-item|work-item-id-123',
          pk: `section-outbox|flavortown|${date}`,
          sk: mockWorkItem.updatedAt,
        },
      });
    });
  });
});
