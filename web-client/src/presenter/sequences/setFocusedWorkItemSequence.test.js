import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setFocusedWorkItemSequence', () => {
  it('should set the workItem to isFocused true when called', async () => {
    test.setState('workQueue', [
      {
        isFocused: false,
        uiKey: 'a',
        workItemId: 'abc',
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      uiKey: 'a',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        isFocused: true,
      },
    ]);
  });

  it('should collapse the alaready expanded work item of uiKey of a', async () => {
    test.setState('workQueue', [
      {
        isFocused: true,
        uiKey: 'a',
        workItemId: 'abc',
      },
      {
        isFocused: false,
        uiKey: 'b',
        workItemId: 'gg',
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      uiKey: 'a',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        isFocused: false,
        uiKey: 'a',
        workItemId: 'abc',
      },
      {
        isFocused: false,
        uiKey: 'b',
        workItemId: 'gg',
      },
    ]);
  });

  it('should expand the work item with a key of b', async () => {
    test.setState('workQueue', [
      {
        isFocused: true,
        uiKey: 'a',
        workItemId: 'abc',
      },
      {
        isFocused: false,
        uiKey: 'b',
        workItemId: 'gg',
      },
    ]);
    await test.runSequence('setFocusedWorkItemSequence', {
      queueType: 'workQueue',
      uiKey: 'b',
    });
    expect(test.getState('workQueue')).toMatchObject([
      {
        isFocused: true,
        uiKey: 'a',
        workItemId: 'abc',
      },
      {
        isFocused: true,
        uiKey: 'b',
        workItemId: 'gg',
      },
    ]);
  });
});
