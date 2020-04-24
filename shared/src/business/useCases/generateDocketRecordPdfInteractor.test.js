import { ContactFactory } from '../entities/contacts/ContactFactory';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_USERS } = require('../../test/mockUsers');

const mockId = '12345';
const mockPdfUrlAndID = { fileId: mockId, url: 'www.example.com' };
const caseDetail = {
  caseCaption: 'Test Case Caption',
  caseId: 'ca-123',
  contactPrimary: {
    address1: 'address 1',
    city: 'City',
    countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
    name: 'Test Petitioner',
    phone: '123-123-1234',
    postalCode: '12345',
    state: 'ST',
  },
  docketNumber: '123-45',
  docketNumberSuffix: 'S',
  docketRecord: [
    {
      createdAt: '2011-10-05T14:48:00.000Z',
      description: 'Test Description',
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
      filingDate: '2011-10-05T14:48:00.000Z',
      index: '1',
    },
    {
      createdAt: '2011-10-05T14:48:00.000Z',
      description: 'Test Description',
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
      filingDate: '2011-10-05T14:48:00.000Z',
      index: '2',
    },
    {
      createdAt: '2011-10-05T14:48:00.000Z',
      description: 'Test Description',
      documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
      filingDate: '2011-10-05T14:48:00.000Z',
      filingsAndProceedings: 'Test F&P',
      index: '3',
    },
  ],
  documents: [
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
  irsPractitioners: [],
  partyType: ContactFactory.PARTY_TYPES.petitioner,
  privatePractitioners: [],
};

beforeAll(() => {
  applicationContext.getCurrentUser.mockReturnValue(
    MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
  );
  applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId.mockReturnValue({ ...caseDetail });
  applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor.mockImplementation(({ contentHtml }) => {
      return contentHtml;
    });
  applicationContext
    .getUseCaseHelpers()
    .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrlAndID);
  applicationContext.getUniqueId.mockReturnValue(mockId);
  applicationContext
    .getTemplateGenerators()
    .generatePrintableDocketRecordTemplate.mockImplementation(
      async ({ content }) => {
        return `<!DOCTYPE html>${content.docketRecord} ${content.partyInfo}</html>`;
      },
    );
});

describe('generateDocketRecordPdfInteractor', () => {
  it('Calls generatePdfFromHtmlInteractor and generatePrintableDocketRecordTemplate to build a PDF', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getTemplateGenerators()
        .generatePrintableDocketRecordTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
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

  it('Displays contactSecondary if associated with the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(() => ({
        ...caseDetail,
        caseId: 'ca123',
        contactSecondary: {
          address1: 'address 1',
          city: 'City',
          countryType: 'domestic',
          name: 'Test Secondary',
          phone: '123-123-1234',
          postalCode: '12345',
          state: 'ST',
        },
        includePartyDetail: true,
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
      }));

    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseId: 'ca123',
      includePartyDetail: true,
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Secondary',
        ),
    ).toEqual(true);
  });

  it('displays no party information if "includePartyDetail" flag is undefined or falsy', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            contactSecondary: {
              address1: 'address 1',
              city: 'City',
              countryType: 'domestic',
              name: 'Test Secondary',
              phone: '123-123-1234',
              postalCode: '12345',
              state: 'ST',
            },
          }),
        }),
      },
      caseId: 'ca123',
      // includePartyDetail not provided, is undefined
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Secondary',
        ),
    ).toEqual(false);

    await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            contactSecondary: {
              address1: 'address 1',
              city: 'City',
              countryType: 'domestic',
              name: 'Test Secondary',
              phone: '123-123-1234',
              postalCode: '12345',
              state: 'ST',
            },
          }),
        }),
      },
      caseId: 'ca123',
      includePartyDetail: false,
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Secondary',
        ),
    ).toEqual(false);
  });

  it('Displays privatePractitioners associated with the case', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            contactSecondary: {
              address1: 'address 1',
              city: 'City',
              countryType: 'domestic',
              name: 'Test Secondary',
              phone: '123-123-1234',
              postalCode: '12345',
              state: 'ST',
            },
            privatePractitioners: [
              {
                addressLine1: '123 Address 1',
                city: 'Some City',
                name: 'Test Practitioner',
                phoneNumber: '99999999',
                representingPrimary: true,
                state: 'ST',
              },
              {
                addressLine1: '321 Address 1',
                city: 'Some City',
                name: 'Test Practitioner 2',
                phoneNumber: '99999999',
                representingSecondary: true,
                state: 'ST',
              },
            ],
          }),
        }),
      },
      caseId: 'ca-123',
      includePartyDetail: true,
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Practitioner',
        ),
    ).toEqual(true);

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Practitioner 2',
        ),
    ).toEqual(true);
  });

  it('Displays irsPractitioners associated with the case', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            irsPractitioners: [
              {
                addressLine1: '123 Address 1',
                city: 'Some City',
                name: 'Test Respondent',
                phoneNumber: '99999999',
                representingPrimary: true,
                state: 'ST',
              },
            ],
          }),
        }),
      },
      caseId: 'ca123',
      includePartyDetail: true,
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Respondent Counsel',
        ),
    ).toEqual(true);

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Respondent',
        ),
    ).toEqual(true);
  });

  it('Displays optional contact information if present', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(() => {
        return {
          ...caseDetail,
          contactPrimary: {
            ...caseDetail.contactPrimary,
            address2: 'Address Two',
            address3: 'Address Three',
            inCareOf: 'Test C/O',
            title: 'Test Title',
          },
        };
      });

    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseId: 'ca-123',
      includePartyDetail: true,
    });

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test C/O',
        ),
    ).toEqual(true);

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Test Title',
        ),
    ).toEqual(true);

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Address Two',
        ),
    ).toEqual(true);

    expect(
      applicationContext
        .getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.partyInfo.includes(
          'Address Three',
        ),
    ).toEqual(true);
  });

  it('Displays caseTitle instead of contactPrimary name when showCaseTitleForPrimary is set', async () => {
    await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: { ...caseDetail },
      includePartyDetail: true,
    });

    expect(
      applicationContext.getTemplateGenerators()
        .generatePrintableDocketRecordTemplate.mock.calls[0][0].content.caption,
    ).toBeDefined();
  });
});
