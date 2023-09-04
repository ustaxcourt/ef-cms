import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getSubmittedCavWorksheetsByJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/getSubmittedCavWorksheetsByJudgeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedCavWorksheetsByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should make a call to get all worksheets for judge', async () => {
    const RETURNED_WORKSHEET = [
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
    ];

    applicationContext
      .getUseCases()
      .getCaseWorksheetsForJudgeInteractor.mockResolvedValue(
        RETURNED_WORKSHEET,
      );

    const {
      output: { worksheets },
    } = await runAction(getSubmittedCavWorksheetsByJudgeAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getCaseWorksheetsForJudgeInteractor,
    ).toHaveBeenCalled();

    expect(worksheets).toBe(RETURNED_WORKSHEET);
  });
});
