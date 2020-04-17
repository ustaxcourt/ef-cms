import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { setWorkItemActionSequence } from '../sequences/setWorkItemActionSequence';

describe('setWorkItemActionSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      setWorkItemActionSequence,
    };
    test = CerebralTest(presenter);
  });
  it('should set the key of the workItemsAction if not already set', async () => {
    test.setState('workItemActions', {});
    await test.runSequence('setWorkItemActionSequence', {
      action: 'complete',
      workItemId: '123',
    });
    expect(test.getState('workItemActions')).toMatchObject({
      '123': 'complete',
    });
  });

  it('should delete the key of the workItemsAction if we do not pass an action', async () => {
    test.setState('workItemActions', {
      '123': 'complete',
    });
    await test.runSequence('setWorkItemActionSequence', {
      workItemId: '123',
    });
    expect(test.getState('workItemActions')).toMatchObject({});
  });

  it('should delete the key of the workItemsAction if we pass the same action twice', async () => {
    test.setState('workItemActions', {
      '123': 'complete',
    });
    await test.runSequence('setWorkItemActionSequence', {
      action: 'complete',
      workItemId: '123',
    });
    expect(test.getState('workItemActions')).toMatchObject({});
  });
});
