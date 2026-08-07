import { MOCK_CASE } from '@shared/test/mockCase';
import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeColvin } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditCaseWorksheetModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setAddEditCaseWorksheetModalStateAction';

describe('setAddEditCaseWorksheetModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should get the worksheet from state based on the given docket number and set it to state.form', async () => {
    const mockWorksheet: RawCaseWorksheet = {
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'CaseWorksheet',
      judgeUserId: judgeColvin.userId,
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

  it('should normalize a finalBriefDueDate that the API returned as an ISO timestamp to YYYY-MM-DD', async () => {
    const mockWorksheet: RawCaseWorksheet = {
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'CaseWorksheet',
      finalBriefDueDate: '2026-08-07T04:00:00.000Z',
      judgeUserId: judgeColvin.userId,
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

    expect(state.form.finalBriefDueDate).toBe('2026-08-07');
    expect(
      new CaseWorksheet(state.form).getFormattedValidationErrors(),
    ).toBeNull();
  });

  it('should leave a finalBriefDueDate that is already YYYY-MM-DD untouched', async () => {
    const mockWorksheet: RawCaseWorksheet = {
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'CaseWorksheet',
      finalBriefDueDate: '2026-08-07',
      judgeUserId: judgeColvin.userId,
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

    expect(state.form.finalBriefDueDate).toBe('2026-08-07');
  });
});
