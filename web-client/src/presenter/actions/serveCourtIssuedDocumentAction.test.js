import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

describe('serveCourtIssuedDocumentAction', () => {
  global.window = global;
  global.Blob = () => {};
  let mockPdfUrl = { pdfUrl: 'www.example.com' };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .serveCourtIssuedDocumentInteractor.mockImplementation(() => mockPdfUrl);
  });

  it('should call the interactor that serves court issued documents and generate a pdf url if a result is returned', async () => {
    const result = await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          documents: [
            {
              documentId: 'document-id',
            },
          ],
        },
        documentId: 'document-id',
      },
    });

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(result.output.pdfUrl).toBe(mockPdfUrl.pdfUrl);
  });

  it('should call the interactor that serves court issued documents and not generate a pdf url if a result is not returned', async () => {
    mockPdfUrl = { pdfUrl: null };

    const result = await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          documents: [
            {
              documentId: 'document-id',
            },
          ],
        },
        documentId: 'document-id',
      },
    });

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(result.output.pdfUrl).toBe(null);
  });
});
