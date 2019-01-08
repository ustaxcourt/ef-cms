import { CerebralTest } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setFocusedWorkItemSequence', async () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  it('should set the workItem to isFocused true when called', async () => {
    test.setState('workQueue', [
      {
        workItemId: 'abc',
        isFocused: false,
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      workItemId: 'abc',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        isFocused: true,
      },
    ]);
  });

  it("should set the workItem's isFocused to false when called if the work item is already focused", async () => {
    test.setState('workQueue', [
      {
        workItemId: 'abc',
        isFocused: true,
      },
      {
        workItemId: 'gg',
        isfocused: false,
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      workItemId: 'abc',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        workItemId: 'abc',
        isFocused: false,
      },
      {
        workItemId: 'gg',
        isfocused: false,
      },
    ]);
  });
});
