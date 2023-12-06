import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getFilterCurrentJudgeUsersAction } from './getFilterCurrentJudgeUsersAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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

    expect(result.output).toMatchObject({
      users: expect.arrayContaining([
        expect.objectContaining({ role: USER_ROLES.judge }),
      ]),
    });

    expect(result.output).not.toMatchObject({
      users: expect.arrayContaining([
        expect.objectContaining({ role: USER_ROLES.legacyJudge }),
      ]),
    });
  });
});
