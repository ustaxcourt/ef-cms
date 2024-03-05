import { MOCK_WORK_ITEM } from '../../../../../shared/src/test/mockWorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { put } from '../../dynamodbClientService';
import { saveWorkItem } from './saveWorkItem';

jest.mock('../../dynamodbClientService');

describe('saveWorkItem', () => {
  const putMock = put as jest.Mock;
  let mockWorkItem;

  beforeEach(() => {
    mockWorkItem = cloneDeep(MOCK_WORK_ITEM);
  });

  it('should persist the work item with a box of `inbox` when the work item has not been completed and is not in progress', async () => {
    mockWorkItem.completedAt = undefined;
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

  it('should persist the work item with `inProgress` when the work item has been completed and is in progress', async () => {
    mockWorkItem.completedAt = undefined;
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

  it('should persist the work item with `pk` of the case and `sk` of the work item', async () => {
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
