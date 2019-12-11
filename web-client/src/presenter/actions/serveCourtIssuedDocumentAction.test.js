import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

const mockCreateObjectUrl = jest.fn();

global.window = global;

global.Blob = () => {};

presenter.providers.router = {
  createObjectURL: () => {
    mockCreateObjectUrl();
    return '123456-abcdef';
  },
};

describe('serveCourtIssuedDocumentAction', () => {
  let serveCourtIssuedDocumentInteractorMock;

  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        serveCourtIssuedDocumentInteractor: serveCourtIssuedDocumentInteractorMock,
      }),
    };
  });

  it('should call the interactor that serves court issued documents and generate a pdf url if a result is returned', async () => {
    serveCourtIssuedDocumentInteractorMock = jest.fn().mockResolvedValue('123');
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

    expect(serveCourtIssuedDocumentInteractorMock).toHaveBeenCalled();
    expect(result.output.pdfUrl).toBeDefined();
  });

  it('should call the interactor that serves court issued documents and not generate a pdf url if a result is not returned', async () => {
    serveCourtIssuedDocumentInteractorMock = jest.fn().mockResolvedValue(null);
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

    expect(serveCourtIssuedDocumentInteractorMock).toHaveBeenCalled();
    expect(result.output.pdfUrl).toBe(null);
  });
});
