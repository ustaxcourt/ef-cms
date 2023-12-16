import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDocketEntryWorksheetAction } from '@web-client/presenter/actions/PendingMotion/updateDocketEntryWorksheetAction';

presenter.providers.applicationContext = applicationContext;

describe('updateDocketEntryWorksheetAction', () => {
  const UPDATED_WORKSHEET = {};

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .updateDocketEntryWorksheetInteractor.mockResolvedValue(
        UPDATED_WORKSHEET,
      );
  });

  it('should call our interactor with the correct data', async () => {
    const results = await runAction(updateDocketEntryWorksheetAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntryId: 'docketEntryId',
          finalBriefDueDate: 'finalBriefDueDate',
          primaryIssue: 'primaryIssue',
          statusOfMatter: 'statusOfMatter',
        },
      },
    });

    const callcount =
      applicationContext.getUseCases().updateDocketEntryWorksheetInteractor.mock
        .calls.length;

    expect(callcount).toEqual(1);

    const params =
      applicationContext.getUseCases().updateDocketEntryWorksheetInteractor.mock
        .calls[0][1];

    expect(params).toEqual({
      worksheet: {
        docketEntryId: 'docketEntryId',
        finalBriefDueDate: 'finalBriefDueDate',
        primaryIssue: 'primaryIssue',
        statusOfMatter: 'statusOfMatter',
      },
    });

    expect(results.output).toEqual({ updatedWorksheet: UPDATED_WORKSHEET });
  });
});
