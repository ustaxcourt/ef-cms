import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { selectWorkItemSequence } from '../sequences/selectWorkItemSequence';

describe('setFocusedWorkItemSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      selectWorkItemSequence,
    };
    test = CerebralTest(presenter);
  });
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
