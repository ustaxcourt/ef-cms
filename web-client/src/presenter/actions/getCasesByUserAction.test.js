import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { User } from '../../../../shared/src/business/entities/User';
import { getCasesByUserAction } from './getCasesByUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getCurrentUser: () => {
    return {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
  },
  getUseCases: () => ({
    getCasesByUserInteractor: () => {
      return [MOCK_CASE];
    },
  }),
};

describe('getCasesByUserAction', () => {
  it('should return a list of cases associated with the specified user', async () => {
    const results = await runAction(getCasesByUserAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output.caseList).toEqual([MOCK_CASE]);
  });
});
