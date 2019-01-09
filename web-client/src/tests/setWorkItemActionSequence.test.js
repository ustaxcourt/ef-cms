import { CerebralTest } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setWorkItemActionSequence', async () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  it('should set the key of the workItemsAction if not already set', async () => {
    test.setState('workItemActions', {});
    await test.runSequence('setWorkItemActionSequence', {
      workItemId: '123',
      action: 'complete',
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
      workItemId: '123',
      action: 'complete',
    });
    expect(test.getState('workItemActions')).toMatchObject({});
  });
});
