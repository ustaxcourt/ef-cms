import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { servePaperFiledDocumentAction } from './servePaperFiledDocumentAction';

describe('servePaperFiledDocumentAction', () => {
  let caseDetail;
  const docketNumber = '123-45';
  const docketEntryId = '456';
  const pdfUrl = 'www.example.com';
  const docketNumbers = [docketNumber];
  const clientConnectionId = '999999999';
  const { DOCUMENT_SERVED_MESSAGES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    caseDetail = {
      docketEntries: [],
      docketNumber,
    };
  });

  it('serves a paper filed document', async () => {
    applicationContext
      .getUseCases()
      .serveExternallyFiledDocumentInteractor.mockReturnValue({ pdfUrl });

    const result = await runAction(servePaperFiledDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        clientConnectionId,
        docketEntryId,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });
    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: DOCUMENT_SERVED_MESSAGES.GENERIC },
      hasPaper: true,
      pdfUrl,
    });
  });

  it('returns hasPaper false when there is no pdfUrl after the document has been served', async () => {
    applicationContext
      .getUseCases()
      .serveExternallyFiledDocumentInteractor.mockImplementation(() => {
        return {};
      });

    const result = await runAction(servePaperFiledDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        clientConnectionId,
        docketEntryId,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveExternallyFiledDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: DOCUMENT_SERVED_MESSAGES.GENERIC },
      hasPaper: false,
      pdfUrl: undefined,
    });
  });
});
