import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPdfUrlAction } from './getPdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPdfUrlAction', () => {
  let createObjectURLStub;

  beforeAll(() => {
    global.File = jest.fn();
    createObjectURLStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };
  });

  it('gets the pdf file url for a court issued document', async () => {
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        eventCode: '0',
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.output.pdfUrl).toBe(mockPdf.url);

    const args =
      applicationContext.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor.mock.calls[0][1];
    expect(args).toEqual(
      expect.objectContaining({
        contentHtml: '<p>hi</p>',
        docketNumber: '123-20',
        documentTitle: 'Test Title',
        eventCode: '0',
      }),
    );
  });

  it('should send the addedDocketNumbers to the order endpoint when some are set in state', async () => {
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        eventCode: '0',
      },
      state: {
        addedDocketNumbers: ['101-20', '102-20'],
        caseDetail: {
          docketNumber: '123-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.output.pdfUrl).toBe(mockPdf.url);

    const args =
      applicationContext.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor.mock.calls[0][1];
    expect(args).toEqual(
      expect.objectContaining({
        addedDocketNumbers: ['101-20', '102-20'],
        contentHtml: '<p>hi</p>',
        docketNumber: '123-20',
        documentTitle: 'Test Title',
        eventCode: '0',
      }),
    );
  });
});
