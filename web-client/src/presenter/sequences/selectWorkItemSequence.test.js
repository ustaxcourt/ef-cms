import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { selectWorkItemSequence } from '../sequences/selectWorkItemSequence';

describe('selectWorkItemSequence', () => {
  let cerebralTest;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      selectWorkItemSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });
  it('should add a work item to the selectedWorkItems state if it does not already exist', async () => {
    cerebralTest.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: '123',
      },
    });
    expect(cerebralTest.getState('selectedWorkItems')).toMatchObject([
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
    cerebralTest.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: 'gg',
      },
    });
    expect(cerebralTest.getState('selectedWorkItems')).toMatchObject([
      {
        workItemId: 'abc',
      },
    ]);
  });
});
