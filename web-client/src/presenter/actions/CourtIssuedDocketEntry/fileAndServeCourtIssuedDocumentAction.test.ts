import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { fileAndServeCourtIssuedDocumentAction } from './fileAndServeCourtIssuedDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const clientConnectionId = 'ABC123';
  const docketNumbers = ['123-20'];

  it('should call the interactor for filing and serving court-issued documents and pass the current clientConnectionId', async () => {
    const mockDocketEntryId = 'abc';
    const mockCaseDetail = {
      docketNumber: '123-20',
      docketEntries: [
        {
          docketEntryId: 'abc',
          draftOrderState: {
            dueDate: '01-01-2001',
            orderType: 'statusReport',
          }
        },
        {
          docketEntryId: 'def',
        }
      ],
    }
    const mockForm = {
      attachments: false,
      date: '2019-01-01T00:00:00.000Z',
      documentTitle: '[Anything]',
      documentType: 'Order',
      eventCode: 'O',
      freeText: 'Testing',
      generatedDocumentTitle: 'Order F',
      scenario: 'Type A',
    };

    await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId,
        docketEntryId: mockDocketEntryId,
        form: mockForm,
      },
    });

    expect(
      applicationContext.getUseCases()
        .fileAndServeCourtIssuedDocumentInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1],
    ).toEqual({
      clientConnectionId,
      docketEntryId: 'abc',
      docketNumbers: ['123-20'],
      form: {
        attachments: false,
        date: '2019-01-01T00:00:00.000Z',
        documentTitle: '[Anything]',
        documentType: 'Order',
        dueDate: '01-01-2001',
        eventCode: 'O',
        freeText: 'Testing',
        generatedDocumentTitle: 'Order F',
        orderType: 'statusReport',
        scenario: 'Type A',
      },
      subjectCaseDocketNumber: '123-20',
    });
  });
});
