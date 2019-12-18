import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

describe('serveCourtIssuedDocumentAction', () => {
  let serveCourtIssuedDocumentInteractorMock;

  beforeEach(() => {
    serveCourtIssuedDocumentInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        serveCourtIssuedDocumentInteractor: serveCourtIssuedDocumentInteractorMock,
      }),
    };
  });
  it('should call the interactor that serves court issued documents', async () => {
    await runAction(serveCourtIssuedDocumentAction, {
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
  });
});
