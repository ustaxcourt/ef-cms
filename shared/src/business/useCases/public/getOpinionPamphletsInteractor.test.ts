import {
  DOCUMENT_SEARCH_SORT,
  OPINION_PAMPHLET_EVENT_CODE,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionPamphletsInteractor } from './getOpinionPamphletsInteractor';

describe('getOpinionPamphletsInteractor', () => {
  const mockOpinionPamphlets = [
    {
      caseCaption: 'Idola Flowers, Donor, Petitioner',
      docketEntryId: 'f5ed9568-7510-427f-b392-aa5b724aca30',
      docketNumber: '121-20',
      docketNumberWithSuffix: '121-20',
      documentTitle: 'Order to Show Cause blah blah blah',
      documentType: 'Order to Show Cause',
      entityName: 'PublicDocumentSearchResult',
      eventCode: 'OSC',
      filingDate: '2020-12-22T17:46:10.158Z',
      isSealed: false,
      isStricken: false,
      numberOfPages: 1,
      signedJudgeName: 'Maurice B. Foley',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: mockOpinionPamphlets,
      });
  });

  it('should make a call to advancedDocumentSearch with the opinion report pamphlet event code', async () => {
    await getOpinionPamphletsInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toEqual({
      applicationContext,
      documentEventCodes: [OPINION_PAMPHLET_EVENT_CODE],
      requireServedDate: false,
      sortField: DOCUMENT_SEARCH_SORT.FILING_DATE_DESC,
    });
  });

  it('should return a list of opinion pamphlets docket entries', async () => {
    const results = await getOpinionPamphletsInteractor(applicationContext);

    expect(results).toMatchObject(mockOpinionPamphlets);
  });
});
