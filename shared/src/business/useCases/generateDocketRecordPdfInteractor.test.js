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
      docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    },
    {
      docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
    },
    {
      additionalInfo2: 'Additional Info 2',
      docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
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

describe('generateDocketRecordPdfInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
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

  it('Calls docketRecord document generator to build a PDF', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: true });
  });

  describe('party detail is requested', () => {
    it('user is associated with the case', async () => {
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
      await generateDocketRecordPdfInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      });

      expect(
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data,
      ).toMatchObject({ includePartyDetail: true });
    });

    it('user has an internal role', async () => {
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'], // docket clerk
      );
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
      await generateDocketRecordPdfInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      });

      expect(
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data,
      ).toMatchObject({ includePartyDetail: true });
    });

    it('user is NOT associated with the case and does NOT have an internal role', async () => {
      applicationContext.getCurrentUser.mockReturnValue({});
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
      await generateDocketRecordPdfInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      });

      expect(
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data,
      ).toMatchObject({ includePartyDetail: false });
    });
  });

  it('Returns a file ID and url to the generated file', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
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
      docketNumber: caseDetail.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: false });
  });

  it('throws an Unauthorized error for an unassociated user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'], //privatePractitioner
    );
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        privatePractitioners: [],
        sealedDate: '2019-08-25T05:00:00.000Z',
      });

    await expect(
      generateDocketRecordPdfInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('throws an Unauthorized error for a public user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({}); //public user
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        sealedDate: '2019-08-25T05:00:00.000Z',
      });

    await expect(
      generateDocketRecordPdfInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('returns a PDF url for an internal user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['c7d90c05-f6cd-442c-a168-202db587f16f'], //petitionsClerk
    );
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        sealedDate: '2019-08-25T05:00:00.000Z',
      });

    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
    });

    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('returns a PDF url for an external, associated user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'], //petitioner
    );
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        userId: 'd7d90c05-f6cd-442c-a168-202db587f16f', //petitioner
      });

    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
    });

    expect(result).toEqual(mockPdfUrlAndID);
  });
});
