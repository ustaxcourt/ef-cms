import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setWorkItemAction } from './setWorkItemAction';

describe('setWorkItemAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
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
