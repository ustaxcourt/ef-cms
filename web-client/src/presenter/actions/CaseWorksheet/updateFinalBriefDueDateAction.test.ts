import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateFinalBriefDueDateAction } from './updateFinalBriefDueDateAction';

describe('updateFinalBriefDueDateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';

  it('should persist the brief due date to the backend', async () => {
    const TEST_FINAL_BRIEF_DUE_DATE = '08/28/2023';

    applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor.mockReturnValue(null);

    await runAction(updateFinalBriefDueDateAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: TEST_DOCKET_NUMBER,
      updatedProps: { finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE },
    });
  });
});
