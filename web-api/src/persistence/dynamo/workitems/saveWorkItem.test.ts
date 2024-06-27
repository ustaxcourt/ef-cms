import { MOCK_WORK_ITEM } from '../../../../../shared/src/test/mockWorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { put } from '../../dynamodbClientService';
import { saveWorkItem } from './saveWorkItem';
import type { RawWorkItem } from '@shared/business/entities/WorkItem';

jest.mock('../../dynamodbClientService');

describe('saveWorkItem', () => {
  const putMock = put as jest.Mock;
  let mockWorkItem: RawWorkItem;

  beforeEach(() => {
    mockWorkItem = cloneDeep(MOCK_WORK_ITEM);
  });

  describe('work item is not completed', () => {
    beforeEach(() => {
      mockWorkItem.completedAt = undefined;
      mockWorkItem.completedBy = undefined;
      mockWorkItem.completedByUserId = undefined;
      mockWorkItem.completedMessage = undefined;
    });

    it('does not put the work item in the outbox', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });
      expect(
        applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
      ).not.toHaveBeenCalled();
    });

    it('persists the work item with a box of `inbox` when the work item is not in progress', async () => {
      mockWorkItem.inProgress = false;

      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item.gsiUserBox).toBe(
        `assigneeId|inbox|${MOCK_WORK_ITEM.assigneeId}`,
      );
      expect(putMock.mock.calls[0][0].Item.gsiSectionBox).toBe(
        `section|inbox|${MOCK_WORK_ITEM.section}`,
      );
    });

    it('persists the work item with `inProgress` when the work item is in progress', async () => {
      mockWorkItem.inProgress = true;

      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item.gsiUserBox).toBe(
        `assigneeId|inProgress|${MOCK_WORK_ITEM.assigneeId}`,
      );
      expect(putMock.mock.calls[0][0].Item.gsiSectionBox).toBe(
        `section|inProgress|${MOCK_WORK_ITEM.section}`,
      );
    });

    it('persists the work item with `pk` of the case and `sk` of the work item', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item.pk).toBe(
        `case|${MOCK_WORK_ITEM.docketNumber}`,
      );
      expect(putMock.mock.calls[0][0].Item.sk).toBe(
        `work-item|${MOCK_WORK_ITEM.workItemId}`,
      );
    });
  });

  describe('work item is completed', () => {
    beforeEach(() => {
      mockWorkItem.completedAt = '2022-02-01T17:21:07.638Z';
      mockWorkItem.completedBy = 'Test Docketclerk';
      mockWorkItem.completedByUserId = '1805d1ab-18d0-43ec-bafb-654e83405416';
      mockWorkItem.completedMessage = 'completed';
    });

    it('puts the work item in the outbox', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });
      expect(
        applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
      ).toHaveBeenCalled();
    });

    it('does not persist the work item with a gsiUserBox value', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item.gsiUserBox).toBeUndefined();
    });

    it('does not persist the work item with a gsiSectionBox value', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item.gsiSectionBox).toBeUndefined();
    });

    it('persists the work item', async () => {
      await saveWorkItem({
        applicationContext,
        workItem: mockWorkItem,
      });

      expect(putMock.mock.calls[0][0].Item).toMatchObject({
        gsi1pk: `work-item|${mockWorkItem.workItemId}`,
        pk: `case|${mockWorkItem.docketNumber}`,
        sk: `work-item|${mockWorkItem.workItemId}`,
        ...mockWorkItem,
      });
    });
  });
});
