import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCoversheetInteractor } from '@shared/business/useCases/getCoversheetInteractor';

jest.mock('@shared/business/useCases/generateCoverSheetData', () => ({
  generateCoverSheetData: () => ({ consolidatedCases: 'consolidatedCases' }),
}));

describe('getCoversheetInteractor', () => {
  beforeAll(() => {
    applicationContext.getPersistenceGateway().getCaseByDocketNumber = jest
      .fn()
      .mockReturnValue(MOCK_CASE);

    applicationContext.getDocumentGenerators().coverSheet = jest
      .fn()
      .mockReturnValue('coverSheetResults');
  });
  it('should get coversheet data', async () => {
    const results = await getCoversheetInteractor(applicationContext, {
      docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    const getCaseByDocketNumberCalls =
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls;
    expect(getCaseByDocketNumberCalls.length).toEqual(1);
    expect(getCaseByDocketNumberCalls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );

    const coverSheetCalls =
      applicationContext.getDocumentGenerators().coverSheet.mock.calls;
    expect(coverSheetCalls.length).toEqual(1);
    expect(coverSheetCalls[0][0].data).toEqual({
      consolidatedCases: 'consolidatedCases',
    });

    expect(results).toEqual({
      consolidatedCases: 'consolidatedCases',
      pdfData: 'coverSheetResults',
    });
  });
});
