import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteDocketEntryWorksheetInteractor } from '@web-api/business/useCases/pendingMotion/deleteDocketEntryWorksheetInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('deleteDocketEntryWorksheetInteractor', () => {
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .deleteDocketEntryWorksheetRecord.mockReturnValue(null);
  });

  it('should throw an Unauthorized Error when user does not have permission', async () => {
    await expect(
      deleteDocketEntryWorksheetInteractor(
        applicationContext,
        TEST_DOCKET_ENTRY_ID,
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should run the persistence method with correct docket entry id', async () => {
    await deleteDocketEntryWorksheetInteractor(
      applicationContext,
      TEST_DOCKET_ENTRY_ID,
      mockDocketClerkUser,
    );

    const { calls } =
      applicationContext.getPersistenceGateway()
        .deleteDocketEntryWorksheetRecord.mock;

    expect(calls.length).toEqual(1);
    expect(calls[0][0].docketEntryId).toEqual(TEST_DOCKET_ENTRY_ID);
  });
});
