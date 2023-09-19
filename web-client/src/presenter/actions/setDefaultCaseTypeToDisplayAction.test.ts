import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultCaseTypeToDisplayAction } from './setDefaultCaseTypeToDisplayAction';

describe('setDefaultCaseTypeToDisplayAction', () => {
  const { EXTERNAL_USER_DASHBOARD_TABS } = applicationContext.getConstants();
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the default value for state.openClosedCases.caseType to "Open"', async () => {
    const result = await runAction(setDefaultCaseTypeToDisplayAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.openClosedCases.caseType).toEqual(
      EXTERNAL_USER_DASHBOARD_TABS.OPEN,
    );
  });
});
