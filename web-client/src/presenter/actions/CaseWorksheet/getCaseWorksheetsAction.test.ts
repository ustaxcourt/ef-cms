import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseWorksheetsAction } from '@web-client/presenter/actions/CaseWorksheet/getCaseWorksheetsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseWorksheetsAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call our get case worksheet interactor', async () => {
    const RETURNED_WORKSHEETS = [
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
    ];
    applicationContext
      .getUseCases()
      .getCaseWorksheetsForJudgeInteractor.mockResolvedValue(
        RETURNED_WORKSHEETS,
      );

    const {
      output: { worksheets },
    } = await runAction(getCaseWorksheetsAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          docketNumber: MOCK_CASE.docketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseWorksheetsForJudgeInteractor,
    ).toHaveBeenCalled();
    expect(worksheets).toBe(RETURNED_WORKSHEETS);
  });
});
