import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateStatusOfMatterAction } from './updateStatusOfMatterAction';

describe('updateStatusOfMatterAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should persist the status of matter to the backend and return the updated case worksheet to props', async () => {
    const TEST_STATUS_OF_MATTER = STATUS_OF_MATTER_OPTIONS[1];
    const mockUpdatedCaseWorksheet: RawCaseWorksheet = {
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'CaseWorksheet',
      statusOfMatter: TEST_STATUS_OF_MATTER,
    };

    applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor.mockResolvedValue(
        mockUpdatedCaseWorksheet,
      );

    const { output } = await runAction(updateStatusOfMatterAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        statusOfMatter: TEST_STATUS_OF_MATTER,
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      updatedProps: {
        statusOfMatter: TEST_STATUS_OF_MATTER,
      },
    });
    expect(output.updatedWorksheet).toEqual(mockUpdatedCaseWorksheet);
  });
});
