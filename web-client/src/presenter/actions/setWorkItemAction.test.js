import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setWorkItemAction } from './setWorkItemAction';

describe('setWorkItemAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = {};
  });

  it('sets workItem in state', async () => {
    const result = await runAction(setWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        workItem: {
          workItemId: 'work-item-id-123',
        },
      },
    });

    expect(result.state.workItem).toEqual({
      workItemId: 'work-item-id-123',
    });
  });
});
