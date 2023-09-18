import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createMessageModalHelper as createMessageModalHelperComputed } from './createMessageModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('createMessageModalHelper', () => {
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
