import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

describe('serveCourtIssuedDocumentAction', () => {
  global.window = global;
  global.Blob = () => {};
  let mockCreateObjectUrl;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    mockCreateObjectUrl = jest.fn();
    presenter.providers.router = {
      createObjectURL: () => {
        mockCreateObjectUrl();
        return '123456-abcdef';
      },
    };
  });

  it('should call the interactor that serves court issued documents and generate a pdf url if a result is returned', async () => {
    applicationContext
      .getUseCases()
      .serveCourtIssuedDocumentInteractor.mockReturnValue({
        size: 123,
        type: 'FakeBlob',
      });

    const result = await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'case-id',
          documents: [
            {
              documentId: 'document-id',
            },
          ],
        },
        documentId: 'document-id',
      },
    });

    expect(mockCreateObjectUrl).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(result.output.pdfUrl).not.toBe(null);
  });

  it('should call the interactor that serves court issued documents and not generate a pdf url if a result is not returned', async () => {
    applicationContext
      .getUseCases()
      .serveCourtIssuedDocumentInteractor.mockReturnValue(null);

    const result = await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'case-id',
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
