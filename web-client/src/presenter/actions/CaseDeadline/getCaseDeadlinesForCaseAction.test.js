import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlinesForCaseAction } from './getCaseDeadlinesForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseDeadlinesForCaseAction', () => {
  const mockCaseDeadlines = [
    {
      caseDeadlineId: 'cd1',
      createdAt: '2019-07-19T20:20:15.680Z',
      deadlineDate: '2020-02-03T05:00:00.000Z',
      description: 'Test case deadline.',
      docketNumber: '123-20',
    },
    {
      caseDeadlineId: 'cd2',
      createdAt: '2019-07-19T20:20:15.680Z',
      deadlineDate: '2030-03-04T05:00:00.000Z',
      description: 'Another test case deadline.',
      docketNumber: '123-20',
    },
  ];

  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .getCaseDeadlinesForCaseInteractor.mockReturnValue(mockCaseDeadlines);

  it('calls getCaseDeadlinesForCaseInteractor', async () => {
    const result = await runAction(getCaseDeadlinesForCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetails: {
          docketNumber: '123-20',
        },
      },
    });
    expect(result.state.caseDeadlines).toEqual(mockCaseDeadlines);
  });
});
