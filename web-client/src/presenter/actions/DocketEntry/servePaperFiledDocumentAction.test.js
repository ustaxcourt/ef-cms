import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { servePaperFiledDocumentAction } from './servePaperFiledDocumentAction';

describe('servePaperFiledDocumentAction', () => {
  let caseDetail;
  const docketNumber = '123-45';
  const docketEntryId = '456';
  const pdfUrl = 'www.example.com';
  const docketNumbers = [docketNumber];

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
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Document served.' },
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
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: { message: 'Document served.' },
      hasPaper: false,
      pdfUrl: undefined,
    });
  });
});
