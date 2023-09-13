import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setWorkItemsAction } from './setWorkItemsAction';

describe('setWorkItemsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets workQueue in state with sorted work items', async () => {
    const result = await runAction(setWorkItemsAction, {
      modules: {
        presenter,
      },
      props: {
        workItems: [
          { updatedAt: 1, workItemId: 'work-item-id-123' },
          { updatedAt: 2, workItemId: 'work-item-id-234' },
          { updatedAt: 3, workItemId: 'work-item-id-345' },
        ],
      },
    });

    expect(result.state.workQueue).toEqual([
      {
        uiKey: expect.anything(),
        updatedAt: 3,
        workItemId: 'work-item-id-345',
      },
      {
        uiKey: expect.anything(),
        updatedAt: 2,
        workItemId: 'work-item-id-234',
      },
      {
        uiKey: expect.anything(),
        updatedAt: 1,
        workItemId: 'work-item-id-123',
      },
    ]);
  });
});
