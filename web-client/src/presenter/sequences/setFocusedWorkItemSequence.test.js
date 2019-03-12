import { CerebralTest } from 'cerebral/test';
import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setFocusedWorkItemSequence', () => {
  it('should set the workItem to isFocused true when called', async () => {
    test.setState('workQueue', [
      {
        isFocused: false,
        workItemId: 'abc',
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

  it('should set the workItems isFocused to false when called if the work item is already focused', async () => {
    test.setState('workQueue', [
      {
        isFocused: true,
        workItemId: 'abc',
      },
      {
        isfocused: false,
        workItemId: 'gg',
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      workItemId: 'abc',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        isFocused: false,
        workItemId: 'abc',
      },
      {
        isfocused: false,
        workItemId: 'gg',
      },
    ]);
  });
});
