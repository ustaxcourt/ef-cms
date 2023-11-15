import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_CASE_WORKSHEET } from '@shared/test/mockCaseWorksheet';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCaseWorksheetAction } from './updateCaseWorksheetAction';

describe('updateCaseWorksheetAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should update the caseworksheet with values from the form', async () => {
    const mockForm = {
      docketNumber: MOCK_CASE.docketNumber,
      statusOfMatter: CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
    };
    applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor.mockResolvedValue(MOCK_CASE_WORKSHEET);

    const { output } = await runAction(updateCaseWorksheetAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockForm,
      },
    });

    expect(output.updatedWorksheet).toEqual(MOCK_CASE_WORKSHEET);
  });
});
