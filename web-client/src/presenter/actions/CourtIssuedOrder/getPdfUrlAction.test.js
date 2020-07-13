import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPdfUrlAction } from './getPdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPdfUrlAction', () => {
  let createObjectURLStub;

  beforeAll(() => {
    global.File = jest.fn();
    createObjectURLStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };
  });

  it('gets the pdf file url for a court issued document', async () => {
    const mockPdf = { url: 'www.example.com' };
    applicationContextForClient
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        signatureText: 'Test Signature',
      },
      state: {
        caseDetail: {
          caseId: '123',
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toBeCalled();
    expect(result.output.pdfUrl).toBe(mockPdf.url);

    const args = applicationContextForClient.getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mock.calls[0][0];

    expect(args).toEqual(
      expect.objectContaining({
        caseId: '123',
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        signatureText: 'Test Signature',
      }),
    );
  });
});
