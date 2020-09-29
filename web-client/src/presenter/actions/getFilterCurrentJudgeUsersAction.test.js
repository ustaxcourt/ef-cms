import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFilterCurrentJudgeUsersAction } from './getFilterCurrentJudgeUsersAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFilterCurrentJudgeUsersAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('filters and return props.users with current (non-legacy) judges', async () => {
    const result = await runAction(getFilterCurrentJudgeUsersAction, {
      modules: {
        presenter,
      },
      props: {
        users: [
          { name: 'I am not a legacy judge', role: USER_ROLES.judge },
          { name: 'I am a legacy judge', role: USER_ROLES.legacyJudge },
        ],
      },
    });

    expect(result.output.users.length).toBe(1);
    expect(result.output.users[0]).toEqual({
      name: 'I am not a legacy judge',
      role: USER_ROLES.judge,
    });
  });
});
