import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createMessageModalHelper as createMessageModalHelperComputed } from './createMessageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('workQueueSectionHelper', () => {
  const createMessageModalHelper = withAppContextDecorator(
    createMessageModalHelperComputed,
    applicationContext,
  );

  it('formats the name field for judge users to include their title', () => {
    const { formattedUsers } = runCompute(createMessageModalHelper, {
      state: {
        users: [
          {
            judgeTitle: 'Judge',
            name: 'Judy',
            role: 'judge',
          },
          {
            judgeTitle: 'Judge',
            name: 'Dredd',
            role: 'legacyJudge',
          },
          {
            name: 'Clerk Kent',
            role: 'docketClerk',
          },
        ],
      },
    });
    expect(formattedUsers).toMatchObject([
      {
        judgeTitle: 'Judge',
        name: 'Judge Judy',
        role: 'judge',
      },
      {
        judgeTitle: 'Judge',
        name: 'Judge Dredd',
        role: 'legacyJudge',
      },
      {
        name: 'Clerk Kent', // no change
        role: 'docketClerk',
      },
    ]);
  });
});
