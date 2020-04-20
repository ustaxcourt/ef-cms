import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { setFocusedWorkItemSequence } from '../sequences/setFocusedWorkItemSequence';
describe('setFocusedWorkItemSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      setFocusedWorkItemSequence,
    };
    test = CerebralTest(presenter);
  });
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

  it('should collapse the already expanded work item of uiKey of a', async () => {
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
