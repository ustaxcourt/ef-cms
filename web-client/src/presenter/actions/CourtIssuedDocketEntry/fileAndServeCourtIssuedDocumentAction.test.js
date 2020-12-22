import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fileAndServeCourtIssuedDocumentAction } from './fileAndServeCourtIssuedDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call the interactor for filing and serving court-issued documents', async () => {
    await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        docketEntryId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .fileAndServeCourtIssuedDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('should return a pdfUrl when one is generated', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    const result = await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        docketEntryId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Document served. ',
      },
      pdfUrl: mockPdfUrl,
    });
  });
});
