import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { serveDocumentAction } from './serveDocumentAction';

describe('serveDocumentAction', () => {
  let serveSignedStipDecisionInteractorStub;

  beforeEach(() => {
    serveSignedStipDecisionInteractorStub = jest.fn().mockReturnValue({
      caseId: 'case-id',
      documents: [
        {
          documentId: 'document-id',
          servedAt: new Date().toISOString(),
          status: 'served',
        },
      ],
    });

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        serveSignedStipDecisionInteractor: serveSignedStipDecisionInteractorStub,
      }),
    };
  });

  it('serves the document', async () => {
    const result = await runAction(serveDocumentAction, {
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

    expect(serveSignedStipDecisionInteractorStub).toHaveBeenCalled();
    expect(result.state.caseDetail.documents[0].status).toEqual('served');
    expect(result.state.caseDetail.documents[0].servedAt).toBeDefined();
    expect(result.output).toMatchObject({
      alertSuccess: {
        title: 'Service has been initiated.',
      },
    });
  });
});
