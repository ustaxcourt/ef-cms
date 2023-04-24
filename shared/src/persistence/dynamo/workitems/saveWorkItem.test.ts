import { MOCK_WORK_ITEM } from '../../../test/mockWorkItem';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
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

  it('should persist the work item without a gsi2pk when the work item has been completed', async () => {
    mockWorkItem.completedAt = '2022-02-01T17:21:07.439Z';

    await saveWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(putMock.mock.calls[0][0].Item.gsi2pk).toBeUndefined();
  });

  it('should persist the work item with a gsi2pk when the work item has not been completed', async () => {
    mockWorkItem.completedAt = undefined;

    await saveWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(putMock.mock.calls[0][0].Item.gsi2pk).toBe(
      `assigneeId|${MOCK_WORK_ITEM.assigneeId}`,
    );
  });
});
