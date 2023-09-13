import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

describe('serveCourtIssuedDocumentAction', () => {
  global.window ??= Object.create(global);
  global.Blob = () => {};
  let mockPdfUrl = { pdfUrl: 'www.example.com' };
  const clientConnectionId = 'ABC123';
  const docketEntryId = 'bbd6f887-1e53-46e4-94e6-b636bf8c832a';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .serveCourtIssuedDocumentInteractor.mockImplementation(() => mockPdfUrl);
  });

  it('should call the interactor that serves court issued documents and pass the clientConnectionId to the interactor', async () => {
    await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers: ['101-20'],
      },
      state: {
        caseDetail: {
          consolidatedCases: [
            { docketNumber: '102-20' },
            { docketNumber: '101-20' },
          ],
          docketEntries: [
            {
              docketEntryId,
              eventCode: 'O',
            },
            {
              docketEntryId: 'a57d7c0c-94a0-4587-8637-36b5effdc424',
              eventCide: 'OST',
            },
          ],
          docketNumber: '101-20',
        },
        clientConnectionId,
        docketEntryId,
      },
    });

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls[0][1],
    ).toEqual({
      clientConnectionId,
      docketEntryId,
      docketNumbers: ['101-20'],
      subjectCaseDocketNumber: '101-20',
    });
  });
});
