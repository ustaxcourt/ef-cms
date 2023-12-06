import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { prepareUserBasedHeadingAction } from './prepareUserBasedHeadingAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareUserBasedHeadingAction', () => {
  presenter.providers.applicationContext = applicationContext;

  let user;
  const { USER_ROLES } = applicationContext.getConstants();
  applicationContext.getCurrentUser = () => user;

  it.each([
    [USER_ROLES.trialClerk, 'Test User - Session Copy'],
    [USER_ROLES.chambers, 'Buch - Session Copy'],
    [USER_ROLES.judge, 'Buch - Session Copy'],
  ])(
    'should set the proper user-based heading for %p',
    async (userRole, expected) => {
      user = { name: 'Test User', role: userRole };
      const result = await runAction(prepareUserBasedHeadingAction, {
        modules: {
          presenter,
        },
        state: {
          formattedTrialSessionDetails: {
            formattedJudge: 'Buch',
          },
        },
      });
      expect(result.output).toEqual({ userHeading: expected });
    },
  );
});
