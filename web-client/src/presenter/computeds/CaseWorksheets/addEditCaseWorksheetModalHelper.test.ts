import { MOCK_CASE } from '@shared/test/mockCase';
import { addEditCaseWorksheetModalHelper as addEditCaseWorksheetModalHelperComputed } from './addEditCaseWorksheetModalHelper';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('addEditCaseWorksheetModalHelper', () => {
  const addEditCaseWorksheetModalHelper = withAppContextDecorator(
    addEditCaseWorksheetModalHelperComputed,
  );

  it('should return the title of the modal, formatted to include the docket number and case title of the case the user is adding a primary issue to', () => {
    const { title } = runCompute(addEditCaseWorksheetModalHelper, {
      state: {
        form: {
          docketNumber: MOCK_CASE.docketNumber,
        },
        submittedAndCavCases: {
          submittedAndCavCasesByJudge: [MOCK_CASE],
        },
      },
    });

    expect(title).toBe(
      `Docket ${MOCK_CASE.docketNumber}: ${applicationContext.getCaseTitle(
        MOCK_CASE.caseCaption,
      )}`,
    );
  });
});
