import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
describe('generateDocketRecordPdfInteractor', () => {
  const generatePdfFromHtmlInteractorMock = jest.fn();
  const generatePrintableDocketRecordTemplateMock = jest.fn();
  const applicationContext = {
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
  };

  const caseDetail = {
    caseCaption: 'Test Case Caption',
    caseCaptionPostfix: 'Test Caption Postfix',
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
    docketRecordWithDocument: [
      {
        index: '1',
        record: {
          createdAtFormatted: '12/27/18',
          description: 'Test Description',
        },
      },
      {
        document: {
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
        },
        index: '2',
        record: {
          createdAtFormatted: '12/27/18',
          description: 'Test Description',
        },
      },
      {
        document: {
          additionalInfo2: 'Addl Info 2',
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
          filingsAndProceedings: '(No Objection)',
          isStatusServed: true,
          servedAtFormatted: '03/27/19 05:54 pm',
        },
        index: '3',
        record: {
          createdAtFormatted: '12/27/18',
          description: 'Test Description',
          filingsAndProceedings: 'Test F&P',
        },
      },
    ],
    practitioners: [],
    respondents: [],
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
      applicationContext,
      caseDetail: {
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
      },
    });

    expect(result.indexOf('Test Secondary')).toBeGreaterThan(-1);
  });

  it('Displays practitioners associated with the case', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: {
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
            formattedName: 'Test Practitioner',
            phoneNumber: '99999999',
            representingPrimary: true,
            state: 'ST',
          },
          {
            addressLine1: '321 Address 1',
            city: 'Some City',
            formattedName: 'Test Practitioner 2',
            phoneNumber: '99999999',
            representingSecondary: true,
            state: 'ST',
          },
        ],
      },
    });

    expect(result.indexOf('Test Practitioner')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Practitioner 2')).toBeGreaterThan(-1);
  });

  it('Displays respondents associated with the case', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: {
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
      },
    });

    expect(result.indexOf('Respondent Counsel')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Respondent')).toBeGreaterThan(-1);
  });

  it('Displays optional contact information if present', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: {
        ...caseDetail,
        contactPrimary: {
          ...caseDetail.contactPrimary,
          inCareOf: 'Test C/O',
          title: 'Test Title',
          address2: 'Address Two',
          address3: 'Address Three',
        },
      },
    });

    expect(result.indexOf('Test C/O')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Title')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toBeGreaterThan(-1);
  });

  it('Displays caseName instead of contactPrimary name when showCaseNameForPrimary is set', async () => {
    const result = await generateDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: {
        ...caseDetail,
        showCaseNameForPrimary: true,
        caseName: 'Test Case Name',
      },
    });

    expect(result.indexOf('Test Case Name')).toBeGreaterThan(-1);
  });
});
