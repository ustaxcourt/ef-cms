import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAllAndCurrentJudgesAction } from './setAllAndCurrentJudgesAction';

describe('setAllAndCurrentJudgesAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should populate state.legacyAndCurrentJudges with all users.props whose role is "judge" or "legacyJudge"', async () => {
    const result = await runAction(setAllAndCurrentJudgesAction, {
      modules: { presenter },
      props: {
        users: [
          { name: 'I am not a legacy judge', role: USER_ROLES.judge },
          { name: 'I am a legacy judge', role: USER_ROLES.legacyJudge },
        ],
      },
    });

    expect(result.state.legacyAndCurrentJudges.length).toBe(2);
  });

  it('should populate state.judges with all users.props whose role is "judge"', async () => {
    const result = await runAction(setAllAndCurrentJudgesAction, {
      modules: { presenter },
      props: {
        users: [
          { name: 'I am not a legacy judge', role: USER_ROLES.judge },
          { name: 'I am a legacy judge', role: USER_ROLES.legacyJudge },
        ],
      },
    });

    expect(result.state.judges.length).toBe(1);
    expect(result.state.judges[0]).toEqual({
      name: 'I am not a legacy judge',
      role: USER_ROLES.judge,
    });
  });
});
