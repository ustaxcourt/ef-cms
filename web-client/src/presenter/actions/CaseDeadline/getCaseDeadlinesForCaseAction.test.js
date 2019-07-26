import { getCaseDeadlinesForCaseAction } from './getCaseDeadlinesForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const mockCaseDeadlines = [
  {
    caseDeadlineId: 'cd1',
    caseId: 'abc',
    createdAt: '2019-07-19T20:20:15.680Z',
    deadlineDate: '2020-02-03T05:00:00.000Z',
    description: 'Test case deadline.',
  },
  {
    caseDeadlineId: 'cd2',
    caseId: 'abc',
    createdAt: '2019-07-19T20:20:15.680Z',
    deadlineDate: '2030-03-04T05:00:00.000Z',
    description: 'Another test case deadline.',
  },
];
presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseDeadlinesForCaseInteractor: () => mockCaseDeadlines,
  }),
  getUtilities: () => ({
    createISODateString: () => '2019-03-01T21:42:29.073Z',
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
    expect(result.state.caseDeadlines).toEqual(mockCaseDeadlines);
  });
});
