import { Case } from '../entities/cases/Case';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
import { getFormattedCaseDetail } from '../utilities/getFormattedCaseDetail';
describe('generateDocketRecordPdfInteractor', () => {
  const generatePdfFromHtmlInteractorMock = jest.fn();
  const generatePrintableDocketRecordTemplateMock = jest.fn();

  const caseDetail = {
    caseCaption: 'Test Case Caption',
    caseId: 'ca-123',
    contactPrimary: {
      address1: 'address 1',
      city: 'City',
      countryType: 'domestic',
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
        additionalInfo2: 'Addl Info 2',
        documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
        isStatusServed: true,
        servedAtFormatted: '03/27/19 05:54 pm',
      },
    ],
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
        generatePrintableDocketRecordTemplate: ({
          docketRecord,
          partyInfo,
        }) => {
          generatePrintableDocketRecordTemplateMock();
          return `<!DOCTYPE html>${docketRecord} ${partyInfo}</html>`;
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
          }),
        }),
      },
      caseId: 'ca123',
    });

    expect(result.indexOf('Test Secondary')).toBeGreaterThan(-1);
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
    });

    expect(result.indexOf('Test Practitioner')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Practitioner 2')).toBeGreaterThan(-1);
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
    });

    expect(result.indexOf('Respondent Counsel')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Respondent')).toBeGreaterThan(-1);
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
    });

    expect(result.indexOf('Test C/O')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Title')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toBeGreaterThan(-1);
  });

  it('Displays caseName instead of contactPrimary name when showCaseNameForPrimary is set', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: { ...caseDetail },
    });

    expect(result.indexOf(caseDetail.caseCaption)).toBeGreaterThan(-1);
  });
});
