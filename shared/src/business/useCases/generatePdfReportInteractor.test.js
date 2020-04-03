import { generatePdfReportInteractor } from './generatePdfReportInteractor';
const { applicationContext } = require('../test/createTestApplicationContext');

describe('generatePdfReportInteractor', () => {
  let uploadMock;

  const mockUniqueId = 'aaa-bbb-ccc';

  beforeEach(() => {
    uploadMock = jest.fn();

    applicationContext
      .getStorageClient()
      .upload.mockImplementation((params, cb) => {
        uploadMock();
        cb();
      });

    applicationContext.getUseCases().generatePdfFromHtmlInteractor.mockReset();

    applicationContext.getUniqueId.mockReturnValue(mockUniqueId);
  });

  it('should call the pdf generator', async () => {
    await generatePdfReportInteractor({
      applicationContext,
      contentHtml: '<p>Test</p>',
    });

    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
  });

  it('catch errors thrown by the pdf generator', async () => {
    let error;

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockRejectedValue(new Error('Whoops'));

    try {
      await generatePdfReportInteractor({
        applicationContext,
        contentHtml: '<p>Test</p>',
      });
    } catch (err) {
      error = err;
    }

    expect(applicationContext.logger.error).toHaveBeenCalled();
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
