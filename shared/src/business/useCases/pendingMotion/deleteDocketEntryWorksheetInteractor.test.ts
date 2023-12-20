import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteDocketEntryWorksheetInteractor } from '@shared/business/useCases/pendingMotion/deleteDocketEntryWorksheetInteractor';
import { docketClerkUser } from '@shared/test/mockUsers';

describe('deleteDocketEntryWorksheetInteractor', () => {
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .deleteDocketEntryWorksheetRecord.mockReturnValue(null);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  it('should throw an Unauthorized Error when user does not have permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    await expect(
      deleteDocketEntryWorksheetInteractor(
        applicationContext,
        TEST_DOCKET_ENTRY_ID,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should run the persistence method with correct docket entry id', async () => {
    await deleteDocketEntryWorksheetInteractor(
      applicationContext,
      TEST_DOCKET_ENTRY_ID,
    );

    const { calls } =
      applicationContext.getPersistenceGateway()
        .deleteDocketEntryWorksheetRecord.mock;

    expect(calls.length).toEqual(1);
    expect(calls[0][0].docketEntryId).toEqual(TEST_DOCKET_ENTRY_ID);
  });
});
