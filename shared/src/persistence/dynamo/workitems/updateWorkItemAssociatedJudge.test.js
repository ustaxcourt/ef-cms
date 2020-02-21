import { updateWorkItemAssociatedJudge } from './updateWorkItemAssociatedJudge';

describe('updateWorkItemAssociatedJudge', () => {
  let applicationContext;
  let queryStub;
  let updateStub;

  beforeEach(() => {
    queryStub = jest.fn().mockResolvedValue({
      Items: [
        {
          pk: 'work-item-123',
          sk: 'work-item-sortKey',
        },
      ],
    });
    updateStub = jest.fn().mockResolvedValue(null);

    applicationContext = {
      environment: { stage: 'local' },
      getDocumentClient: () => ({
        query: () => ({ promise: queryStub }),
        update: () => ({ promise: updateStub }),
      }),
    };
  });

  it('updates workItem with an associated judge', async () => {
    await updateWorkItemAssociatedJudge({
      applicationContext,
      associatedJudge: 'Guy Fieri',
      workItemId: 'work-item-123',
    });

    expect(queryStub).toHaveBeenCalled();
    expect(updateStub).toHaveBeenCalled();
  });
});
