import { generatePdfReportInteractor } from './generatePdfReportInteractor';

describe('generatePdfReportInteractor', () => {
  let errorMock;
  let generatePdfFromHtmlInteractorMock;
  let uploadMock;
  let applicationContext;

  const mockUniqueId = 'aaa-bbb-ccc';

  beforeEach(() => {
    errorMock = jest.fn();
    generatePdfFromHtmlInteractorMock = jest.fn();
    uploadMock = jest.fn();

    applicationContext = {
      environment: {
        tempDocumentsBucketName: 'test',
      },
      getStorageClient: () => ({
        upload: (params, cb) => {
          uploadMock();
          cb();
        },
      }),
      getUniqueId: () => mockUniqueId,
      getUseCases: () => ({
        generatePdfFromHtmlInteractor: generatePdfFromHtmlInteractorMock,
      }),
      logger: {
        error: errorMock,
      },
    };
  });

  it('should call the pdf generator', async () => {
    await generatePdfReportInteractor({
      applicationContext,
      contentHtml: '<p>Test</p>',
    });

    expect(generatePdfFromHtmlInteractorMock).toHaveBeenCalled();
  });

  it('catch errors thrown by the pdf generator', async () => {
    let error;

    generatePdfFromHtmlInteractorMock = jest
      .fn()
      .mockRejectedValue(new Error('Whoops'));

    try {
      await generatePdfReportInteractor({
        applicationContext,
        contentHtml: '<p>Test</p>',
      });
    } catch (err) {
      error = err;
    }

    expect(errorMock).toHaveBeenCalled();
    expect(error.message).toEqual('Whoops');
  });

  it('should use the s3 client to upload the generated document', async () => {
    await generatePdfReportInteractor({
      applicationContext,
      contentHtml: '<p>Test</p>',
    });
    expect(uploadMock).toHaveBeenCalled();
  });

  it('should return a document reference after the document is uploaded', async () => {
    const result = await generatePdfReportInteractor({
      applicationContext,
      contentHtml: '<p>Test</p>',
    });
    expect(result).toEqual(`document-${mockUniqueId}.pdf`);
  });

  it('should return a document reference with the provded documentIdPrefix if provided', async () => {
    const result = await generatePdfReportInteractor({
      applicationContext,
      contentHtml: '<p>Test</p>',
      documentIdPrefix: 'generated-document-test',
    });
    expect(result).toEqual(`generated-document-test-${mockUniqueId}.pdf`);
  });
});
