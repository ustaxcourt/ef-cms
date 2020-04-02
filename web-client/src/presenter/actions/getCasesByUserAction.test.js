import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesByUserAction } from './getCasesByUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCasesByUserAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.privatePractitioner,
      userId: '123',
    });
    applicationContext
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
