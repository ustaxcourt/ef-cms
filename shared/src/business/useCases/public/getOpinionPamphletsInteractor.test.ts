import { OPINION_PAMPHLET_EVENT_CODE } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionPamphletsInteractor } from './getOpinionPamphletsInteractor';

describe('getOpinionPamphletsInteractor', () => {
  const mockOpinionPamphlets = [
    {
      _score: 8.051047,
      caseCaption: 'Idola Flowers, Donor, Petitioner',
      contactPrimary: {
        address1: '27 South Cowley Extension',
        address2: 'Ab sed culpa aliquam',
        address3: 'Sunt nihil pariatur',
        city: 'Ullamco culpa eos n',
        contactId: '1566ea80-1d95-42bc-b006-7fc55c698dea',
        countryType: 'domestic',
        isAddressSealed: false,
        name: 'Idola Flowers',
        phone: '+1 (166) 728-1619',
        postalCode: '64258',
        sealedAndUnavailable: false,
        serviceIndicator: 'Paper',
        state: 'VA',
      },
      docketEntryId: 'f5ed9568-7510-427f-b392-aa5b724aca30',
      docketNumber: '121-20',
      docketNumberWithSuffix: '121-20',
      documentTitle: 'Order to Show Cause blah blah blah',
      documentType: 'Order to Show Cause',
      eventCode: 'OSC',
      filingDate: '2020-12-22T17:46:10.158Z',
      irsPractitioners: [],
      isSealed: false,
      isStricken: false,
      numberOfPages: 1,
      privatePractitioners: [],
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
        .calls[0][0].documentEventCodes,
    ).toEqual([OPINION_PAMPHLET_EVENT_CODE]);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].requireServedDate,
    ).toBe(false);
  });

  it('should return a list of opinion pamphlets docket entries', async () => {
    const results = await getOpinionPamphletsInteractor(applicationContext);

    expect(results).toBe(mockOpinionPamphlets);
  });
});
