import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShouldIncludePartyDetailAction } from './getShouldIncludePartyDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const { USER_ROLES } = applicationContext.getConstants();

describe('getShouldIncludePartyDetailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    global.window = global;
  });

  it('returns shouldIncludePartyDtail true if the user is not an irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = await runAction(getShouldIncludePartyDetailAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(result.output.shouldIncludePartyDetail).toBe(true);
  });

  it('returns shouldIncludePartyDtail true if the user is an irsPractitioner and props.isAssociated is true', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.irsPractitioner,
    });

    const result = await runAction(getShouldIncludePartyDetailAction, {
      modules: {
        presenter,
      },
      props: {
        isAssociated: true,
      },
    });

    expect(result.output.shouldIncludePartyDetail).toBe(true);
  });

  it('returns shouldIncludePartyDtail false if the user is an irsPractitioner and props.isAssociated is false', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.irsPractitioner,
    });

    const result = await runAction(getShouldIncludePartyDetailAction, {
      modules: {
        presenter,
      },
      props: {
        isAssociated: false,
      },
    });

    expect(result.output.shouldIncludePartyDetail).toBe(false);
  });
});
