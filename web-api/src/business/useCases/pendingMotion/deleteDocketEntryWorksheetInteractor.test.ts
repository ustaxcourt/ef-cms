jest.mock(
  '@web-api/persistence/postgres/docketEntryWorksheets/deleteDocketEntryWorksheet.ts',
);
import { UnauthorizedError } from '@web-api/errors/errors';
import { deleteDocketEntryWorksheetInteractor } from '@web-api/business/useCases/pendingMotion/deleteDocketEntryWorksheetInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { deleteDocketEntryWorksheet as deleteDocketEntryWorksheetMock } from '@web-api/persistence/postgres/docketEntryWorksheets/deleteDocketEntryWorksheet';

describe('deleteDocketEntryWorksheetInteractor', () => {
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';
  const deleteDocketEntryWorksheet = jest.mocked(
    deleteDocketEntryWorksheetMock,
  );

  it('should throw an Unauthorized Error when user does not have permission', async () => {
    await expect(
      deleteDocketEntryWorksheetInteractor(
        TEST_DOCKET_ENTRY_ID,
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should run the persistence method with correct docket entry id', async () => {
    await deleteDocketEntryWorksheetInteractor(
      TEST_DOCKET_ENTRY_ID,
      mockDocketClerkUser,
    );

    const { calls } = deleteDocketEntryWorksheet.mock;

    expect(calls.length).toEqual(1);
    expect(calls[0][0].docketEntryId).toEqual(TEST_DOCKET_ENTRY_ID);
  });
});
