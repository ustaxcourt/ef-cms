import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateStatusOfMatterAction } from './updateStatusOfMatterAction';

describe('updateStatusOfMatterAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';

  it('should persist the status of matter to the backend', async () => {
    const TEST_STATUS_OF_MATTER = STATUS_OF_MATTER_OPTIONS[1];

    applicationContext
      .getUseCases()
      .updateCaseWorksheetInfoInteractor.mockReturnValue(null);

    await runAction(updateStatusOfMatterAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        statusOfMatter: TEST_STATUS_OF_MATTER,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInfoInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: TEST_DOCKET_NUMBER,
      statusOfMatter: TEST_STATUS_OF_MATTER,
    });
  });
});
