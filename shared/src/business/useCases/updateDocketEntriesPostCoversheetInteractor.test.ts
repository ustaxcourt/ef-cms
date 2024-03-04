import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { updateDocketEntriesPostCoversheetInteractor } from '@shared/business/useCases/updateDocketEntriesPostCoversheetInteractor';

describe('updateDocketEntriesPostCoversheetInteractor', () => {
  beforeAll(() => {
    applicationContext.getPersistenceGateway().getCaseByDocketNumber = jest
      .fn()
      .mockReturnValue(MOCK_CASE);
    applicationContext.getPersistenceGateway().updateDocketEntry = jest.fn();
  });

  it('should update docket entries with processingStatus and number of pages after generating coversheet', async () => {
    const results = await updateDocketEntriesPostCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        updatedDocketEntryData: {
          consolidatedCases: [
            {
              docketNumber: MOCK_CASE.docketNumber,
              documentNumber: '123',
            },
            {
              docketNumber: MOCK_CASE.docketNumber,
            },
            {
              docketNumber: '999-99',
              documentNumber: '234',
            },
          ],
          numberOfPages: 999,
        },
      },
    );

    const getCaseByDocketNumberCalls =
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls;

    expect(getCaseByDocketNumberCalls.length).toEqual(2);
    expect(getCaseByDocketNumberCalls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );
    expect(getCaseByDocketNumberCalls[1][0].docketNumber).toEqual('999-99');

    const updateDocketEntryCalls =
      applicationContext.getPersistenceGateway().updateDocketEntry.mock.calls;
    expect(updateDocketEntryCalls.length).toEqual(2);

    expect(updateDocketEntryCalls[0][0].docketEntryId).toEqual(
      MOCK_CASE.docketEntries[0].docketEntryId,
    );
    expect(updateDocketEntryCalls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );
    expect(updateDocketEntryCalls[0][0].document).toMatchObject({
      numberOfPages: 999,
      processingStatus: 'complete',
    });

    expect(updateDocketEntryCalls[1][0].docketEntryId).toEqual(
      MOCK_CASE.docketEntries[0].docketEntryId,
    );
    expect(updateDocketEntryCalls[1][0].docketNumber).toEqual('999-99');
    expect(updateDocketEntryCalls[1][0].document).toMatchObject({
      numberOfPages: 999,
      processingStatus: 'complete',
    });

    expect(results).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
    });
  });
});
