import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setWorkItemActionMapAction } from './setWorkItemActionMapAction';

describe('setWorkItemActionMapAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('deletes the workItemAction if there is no props.action', async () => {
    const result = await runAction(setWorkItemActionMapAction, {
      modules: {
        presenter,
      },
      props: {
        workItemId: 'work-item-id-123',
      },
      state: {
        workItemActions: {
          'work-item-id-123': 'history',
        },
      },
    });

    expect(result.state).toMatchObject({
      workItemActions: {},
      workItemMetadata: {},
    });
  });

  it('deletes the workItemAction if the action matches up', async () => {
    const result = await runAction(setWorkItemActionMapAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'complete',
        workItemId: 'work-item-id-123',
      },
      state: {
        workItemActions: {
          'work-item-id-123': 'complete',
        },
      },
    });

    expect(result.state).toMatchObject({
      workItemActions: {},
      workItemMetadata: {},
    });
  });

  it('sets the workItemAction', async () => {
    const result = await runAction(setWorkItemActionMapAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'complete',
        workItemId: 'work-item-id-123',
      },
      state: {
        workItemActions: {
          'work-item-id-123': 'history',
        },
      },
    });

    expect(result.state).toMatchObject({
      workItemActions: {
        'work-item-id-123': 'complete',
      },
      workItemMetadata: {},
    });
  });
});
