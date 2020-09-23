import {
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '../entities/EntityConstants';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_USERS } = require('../../test/mockUsers');

const mockId = '12345';
const mockPdfUrlAndID = { fileId: mockId, url: 'www.example.com' };
const caseDetail = {
  caseCaption: 'Test Case Caption',
  contactPrimary: {
    address1: 'address 1',
    city: 'City',
    countryType: COUNTRY_TYPES.DOMESTIC,
    name: 'Test Petitioner',
    phone: '123-123-1234',
    postalCode: '12345',
    state: 'AL',
  },
  docketEntries: [
    {
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    },
    {
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
    },
    {
      additionalInfo2: 'Additional Info 2',
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
      isStatusServed: true,
      servedAtFormatted: '03/27/19',
    },
  ],
  docketNumber: '123-45',
  docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
  irsPractitioners: [],
  partyType: PARTY_TYPES.petitioner,
  privatePractitioners: [],
};

beforeAll(() => {
  applicationContext.getCurrentUser.mockReturnValue(
    MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
  );
  applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber.mockReturnValue({ ...caseDetail });
  applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor.mockImplementation(({ contentHtml }) => {
      return contentHtml;
    });
  applicationContext
    .getUseCaseHelpers()
    .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrlAndID);
  applicationContext.getUniqueId.mockReturnValue(mockId);
});

describe('generateDocketRecordPdfInteractor', () => {
  it('Calls docketRecord document generator to build a PDF', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: true });
  });

  it('Returns a file ID and url to the generated file', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalled();
    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('defaults includePartyDetail to false when a value has not been provided', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail,
    });

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: false });
  });
});
