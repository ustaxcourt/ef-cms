import { MOCK_CASE } from '@shared/test/mockCase';
import { addEditCaseWorksheetModalHelper as addEditCaseWorksheetModalHelperComputed } from './addEditCaseWorksheetModalHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
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

  it('should throw an error when the case worksheet to edit cannot be found', () => {
    expect(() =>
      runCompute(addEditCaseWorksheetModalHelper, {
        state: {
          form: {
            docketNumber: '3028-20',
          },
          submittedAndCavCases: {
            submittedAndCavCasesByJudge: [MOCK_CASE],
          },
        },
      }),
    ).toThrow('Could not find case worksheet to edit');
  });
});
