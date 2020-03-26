import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { User } from '../../../../shared/src/business/entities/User';
import { getCasesByUserAction } from './getCasesByUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getCasesByUserAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContextForClient;
    applicationContextForClient.getCurrentUser.mockReturnValue({
      role: User.ROLES.privatePractitioner,
      userId: '123',
    });
    applicationContextForClient
      .getUseCases()
      .getCasesByUserInteractor.mockReturnValue([MOCK_CASE]);
  });

  it('should return a list of cases associated with the specified user', async () => {
    const results = await runAction(getCasesByUserAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output.caseList).toEqual([MOCK_CASE]);
  });
});
