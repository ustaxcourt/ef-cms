import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { servePaperFiledDocumentAction } from './servePaperFiledDocumentAction';

presenter.providers.applicationContext = applicationContext;

describe('servePaperFiledDocumentAction', () => {
  let caseDetail;
  const docketNumber = '123-45';
  const documentId = '456';
  const paperServicePdfUrl = 'www.example.com';

  beforeAll(() => {
    caseDetail = {
      docketNumber,
      documents: [],
    };
  });

  it('serves a paper filed document', async () => {
    applicationContext
      .getUseCases()
      .serveExternallyFiledDocumentInteractor.mockImplementation(async () => {
        return { paperServicePdfUrl };
      });

    const result = await runAction(servePaperFiledDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        documentId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][0],
    ).toMatchObject({ docketNumber, documentId });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Document served.' },
      hasPaper: true,
      pdfUrl: paperServicePdfUrl,
    });
  });

  it('returns hasPaper false when there is no paperServicePdfUrl after the document has been served', async () => {
    applicationContext
      .getUseCases()
      .serveExternallyFiledDocumentInteractor.mockImplementation(async () => {
        return {};
      });

    const result = await runAction(servePaperFiledDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        documentId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][0],
    ).toMatchObject({ docketNumber, documentId });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Document served.' },
      hasPaper: false,
      pdfUrl: undefined,
    });
  });
});
