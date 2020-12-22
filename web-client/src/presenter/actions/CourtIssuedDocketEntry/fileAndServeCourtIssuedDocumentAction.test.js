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

  it('should call the interactor with props.computedDate as the date field', async () => {
    await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-08-25T05:00:00.000Z',
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
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][0].documentMeta,
    ).toMatchObject({
      date: '2019-08-25T05:00:00.000Z',
    });
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
