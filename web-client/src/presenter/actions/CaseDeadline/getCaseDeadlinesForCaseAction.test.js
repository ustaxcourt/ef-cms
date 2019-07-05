import { getCaseDeadlinesForCaseAction } from './getCaseDeadlinesForCaseAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseDeadlinesForCaseInteractor: () => ['hello', 'world'],
  }),
};

describe('getCaseDeadlinesForCaseAction', () => {
  it('calls getCaseDeadlinesForCaseInteractor', async () => {
    const result = await runAction(getCaseDeadlinesForCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetails: {
          caseId: 'abc',
        },
      },
    });
    expect(result.state.caseDetail.caseDeadlines).toEqual(['hello', 'world']);
  });
});
