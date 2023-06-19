import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSubmittedAndCavCasesByJudgeAction } from './getSubmittedAndCavCasesByJudgeAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return it to props', async () => {
    const judgesSelection = [judgeUser.name];
    const mockReturnedCases = [
      {
        docketNumber: '101-22',
        leadDocketNumber: '101-22',
        status: 'Submitted',
      },
      { docketNumber: '111-11', status: 'Submitted' },
      { docketNumber: '134-21', status: 'CAV' },
    ];
    (
      applicationContext.getUseCases()
        .getCasesByStatusAndByJudgeInteractor as jest.Mock
    ).mockReturnValue({
      cases: mockReturnedCases,
      consolidatedCasesGroupCountMap: { '101-22': 3 },
    });

    const { output } = await runAction(
      getSubmittedAndCavCasesByJudgeAction as any,
      {
        modules: {
          presenter,
        },
        state: {
          judgeActivityReport: {
            filters: {
              judgesSelection,
            },
          },
        },
      },
    );

    expect(
      (
        applicationContext.getUseCases()
          .getCasesByStatusAndByJudgeInteractor as jest.Mock
      ).mock.calls[0][1],
    ).toMatchObject({
      judgesSelection,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });
    expect(output.submittedAndCavCasesByJudge).toBe(mockReturnedCases);
    expect(
      output.consolidatedCasesGroupCountMap.get(
        mockReturnedCases[0].leadDocketNumber,
      ),
    ).toBe(3);
  });
});
