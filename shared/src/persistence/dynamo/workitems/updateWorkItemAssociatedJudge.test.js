import { updateWorkItemAssociatedJudge } from './updateWorkItemAssociatedJudge';
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');

describe('updateWorkItemAssociatedJudge', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: 'work-item-123',
              sk: 'work-item-sortKey',
            },
          ],
        }),
    });
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('updates workItem with an associated judge', async () => {
    await updateWorkItemAssociatedJudge({
      applicationContext,
      associatedJudge: 'Guy Fieri',
      workItemId: 'work-item-123',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(applicationContext.getDocumentClient().update).toHaveBeenCalled();
  });
});
