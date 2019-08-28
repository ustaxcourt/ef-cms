import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
describe('generateDocketRecordPdfInteractor', () => {
  const generatePdfFromHtmlInteractorMock = jest.fn();
  const generatePrintableDocketRecordTemplateMock = jest.fn();
  const applicationContext = {
    getTemplateGenerators: () => {
      return {
        generatePrintableDocketRecordTemplate: () => {
          generatePrintableDocketRecordTemplateMock();
          return '<!DOCTYPE html>';
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
        document: {
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
        },
        filingsAndProceedings: 'Test F&P',
        index: '1',
        record: {
          createdAtFormatted: '12/27/18',
          description: 'Test Description',
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
});
