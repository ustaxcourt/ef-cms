import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { deleteDocketEntryWorksheetAction } from '@web-client/presenter/actions/PendingItems/deleteDocketEntryWorksheetAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContextForClient;

describe('deleteDocketEntryWorksheetAction', () => {
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';

  beforeEach(() => {
    applicationContextForClient
      .getUseCases()
      .deleteDocketEntryWorksheetInteractor.mockReturnValue(null);
  });

  it('should run the interactor with correct docket entry id', async () => {
    const result = await runAction(deleteDocketEntryWorksheetAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetails: 'CASE_DETAILS',
        docketEntryId: TEST_DOCKET_ENTRY_ID,
      },
    });

    const { calls } =
      applicationContextForClient.getUseCases()
        .deleteDocketEntryWorksheetInteractor.mock;

    expect(calls.length).toEqual(1);
    expect(calls[0][1]).toEqual({ docketEntryId: TEST_DOCKET_ENTRY_ID });
    expect(result.output).toEqual({
      caseDetails: 'CASE_DETAILS',
      docketEntryId: TEST_DOCKET_ENTRY_ID,
    });
  });
});
