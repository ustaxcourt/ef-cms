import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsTabsToDisplayAction } from './setTrialSessionsTabsToDisplayAction';
import { values, without } from 'lodash';

describe('setTrialSessionsTabsToDisplayAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  [ROLES.chambers, ROLES.judge].forEach(role => {
    it(`should hide the new tab when role is ${role}`, async () => {
      applicationContext.getCurrentUser.mockImplementation(() => ({
        role,
      }));

      const result = await runAction(setTrialSessionsTabsToDisplayAction, {
        modules: {
          presenter,
        },
      });
      expect(result.state.screenMetadata.showNewTab).toEqual(false);
    });
  });

  without(values(ROLES), ROLES.chambers, ROLES.judge).forEach(role => {
    it(`should show the new tab when role is ${role}`, async () => {
      applicationContext.getCurrentUser.mockImplementation(() => ({
        role: ROLES[role],
      }));

      const result = await runAction(setTrialSessionsTabsToDisplayAction, {
        modules: {
          presenter,
        },
      });
      expect(result.state.screenMetadata.showNewTab).toEqual(true);
    });
  });
});
