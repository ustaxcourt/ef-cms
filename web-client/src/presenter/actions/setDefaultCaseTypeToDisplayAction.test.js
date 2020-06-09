import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
