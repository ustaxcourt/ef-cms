import { CerebralTest } from 'cerebral/test';

import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setFocusedWorkItemSequence', async () => {
  it('should add a work item to the selectedWorkItems state if it does not already exist', async () => {
    test.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await test.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: '123',
      },
    });
    expect(test.getState('selectedWorkItems')).toMatchObject([
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
      {
        workItemId: '123',
      },
    ]);
  });

  it('should remove a work item that was already selected from the selectedWorkItems state', async () => {
    test.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await test.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: 'gg',
      },
    });
    expect(test.getState('selectedWorkItems')).toMatchObject([
      {
        workItemId: 'abc',
      },
    ]);
  });
});
