import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateFinalBriefDueDateAction } from './updateFinalBriefDueDateAction';

describe('updateFinalBriefDueDateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should persist the brief due date to the backend when the current user is a chambers user', async () => {
    const TEST_FINAL_BRIEF_DUE_DATE = '08/28/2023';
    applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor.mockReturnValue(null);

    await runAction(updateFinalBriefDueDateAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      updatedProps: { finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE },
    });
  });
});
