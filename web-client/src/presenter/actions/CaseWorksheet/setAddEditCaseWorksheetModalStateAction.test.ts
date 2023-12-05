import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditCaseWorksheetModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setAddEditCaseWorksheetModalStateAction';

describe('setAddEditCaseWorksheetModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should get the worksheet from state based on the given docket number and set it to state.form', async () => {
    const mockWorksheet: RawCaseWorksheet = {
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'CaseWorksheet',
    };

    const { state } = await runAction(setAddEditCaseWorksheetModalStateAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        submittedAndCavCases: {
          submittedAndCavCasesByJudge: [
            {
              caseWorksheet: mockWorksheet,
              docketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      },
    });

    expect(state.form).toEqual(mockWorksheet);
  });

  it("should default state.form to the provided docket number when the case worksheet doesn't exist for the given docket number", async () => {
    const { state } = await runAction(setAddEditCaseWorksheetModalStateAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        submittedAndCavCases: {
          submittedAndCavCasesByJudge: [
            { caseWorksheet: undefined, docketNumber: MOCK_CASE.docketNumber },
          ],
        },
      },
    });

    expect(state.form).toEqual({ docketNumber: MOCK_CASE.docketNumber });
  });
});
