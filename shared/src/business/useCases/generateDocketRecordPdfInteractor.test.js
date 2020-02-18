import { Case } from '../entities/cases/Case';
import { ContactFactory } from '../entities/contacts/ContactFactory';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
import { getFormattedCaseDetail } from '../utilities/getFormattedCaseDetail';
const { MOCK_USERS } = require('../../test/mockUsers');

describe('generateDocketRecordPdfInteractor', () => {
  const generatePdfFromHtmlInteractorMock = jest.fn();
  const generatePrintableDocketRecordTemplateMock = jest.fn();

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
        createdAt: '12/27/18',
        description: 'Test Description',
        documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
        filingDate: '12/27/18',
        index: '1',
      },
      {
        createdAt: '12/27/18',
        description: 'Test Description',
        documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
        filingDate: '12/27/18',
        index: '2',
      },
      {
        createdAt: '12/27/18',
        description: 'Test Description',
        documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
        filingDate: '12/27/18',
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
    partyType: ContactFactory.PARTY_TYPES.petitioner,
    practitioners: [],
    respondents: [],
  };

  const applicationContext = {
    getCaseCaptionNames: Case.getCaseCaptionNames,
    getConstants: () => ({
      ORDER_TYPES_MAP: [
        {
          documentType: 'Decision',
        },
      ],
    }),
    getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    getEntityConstructors: () => ({
      Case,
    }),
    getPersistenceGateway: () => ({
      getCaseByCaseId: () => ({
        ...caseDetail,
      }),
    }),
    getTemplateGenerators: () => {
      return {
        generatePrintableDocketRecordTemplate: async ({ content }) => {
          generatePrintableDocketRecordTemplateMock();
          return `<!DOCTYPE html>${content.docketRecord} ${content.partyInfo}</html>`;
        },
      };
    },
    getUseCases: () => {
      return {
        generatePdfFromHtmlInteractor: ({ contentHtml }) => {
          generatePdfFromHtmlInteractorMock();
          return contentHtml;
        },
      };
    },
    getUtilities: () => ({
      formatDateString: date => date,
      getFormattedCaseDetail,
      setServiceIndicatorsForCase: () => null,
    }),
  };

  it('Calls generatePdfFromHtmlInteractor and generatePrintableDocketRecordTemplate to build a PDF', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail,
      includePartyDetail: true,
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(generatePrintableDocketRecordTemplateMock).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorMock).toHaveBeenCalled();
  });

  it('Displays contactSecondary if associated with the case', async () => {
    const result = await generateDocketRecordPdfInteractor({
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
            partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
          }),
        }),
      },
      caseId: 'ca123',
      includePartyDetail: true,
    });

    expect(result.includes('Test Secondary')).toEqual(true);
  });

  it('displays no party information if "includePartyDetail" flag is undefined or falsy', async () => {
    let result = await generateDocketRecordPdfInteractor({
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

    expect(result.includes('Test Secondary')).toEqual(false);

    result = await generateDocketRecordPdfInteractor({
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

    expect(result.includes('Test Secondary')).toEqual(false);
  });

  it('Displays practitioners associated with the case', async () => {
    const result = await generateDocketRecordPdfInteractor({
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
            practitioners: [
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

    expect(result.includes('Test Practitioner')).toEqual(true);
    expect(result.includes('Test Practitioner 2')).toEqual(true);
  });

  it('Displays respondents associated with the case', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            respondents: [
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

    expect(result.includes('Respondent Counsel')).toEqual(true);
    expect(result.includes('Test Respondent')).toEqual(true);
  });

  it('Displays optional contact information if present', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext: {
        ...applicationContext,
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({
            ...caseDetail,
            contactPrimary: {
              ...caseDetail.contactPrimary,
              address2: 'Address Two',
              address3: 'Address Three',
              inCareOf: 'Test C/O',
              title: 'Test Title',
            },
          }),
        }),
      },
      caseId: 'ca-123',
      includePartyDetail: true,
    });

    expect(result.includes('Test C/O')).toEqual(true);
    expect(result.includes('Test Title')).toEqual(true);
    expect(result.includes('Address Two')).toEqual(true);
    expect(result.includes('Address Three')).toEqual(true);
  });

  it('Displays caseName instead of contactPrimary name when showCaseNameForPrimary is set', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: { ...caseDetail },
      includePartyDetail: true,
    });

    expect(result.includes(caseDetail.caseCaption)).toEqual(true);
  });
});
