import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { servePaperFiledDocumentAction } from './servePaperFiledDocumentAction';

presenter.providers.applicationContext = applicationContext;

describe('servePaperFiledDocumentAction', () => {
  let caseDetail;
  const docketNumber = '123-45';
  const docketEntryId = '456';
  const paperServicePdfUrl = 'www.example.com';

  beforeAll(() => {
    caseDetail = {
      docketEntries: [],
      docketNumber,
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
        docketEntryId,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][0],
    ).toMatchObject({ docketEntryId, docketNumber });

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
        docketEntryId,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][0],
    ).toMatchObject({ docketEntryId, docketNumber });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Document served.' },
      hasPaper: false,
      pdfUrl: undefined,
    });
  });
});
