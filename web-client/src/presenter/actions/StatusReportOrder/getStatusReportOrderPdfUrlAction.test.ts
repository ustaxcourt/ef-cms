import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getStatusReportOrderPdfUrlAction } from './getStatusReportOrderPdfUrlAction';
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

  it('generates a pdf url for a non-lead case', async () => {
    const docketNumber = '1234-ABC';
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getStatusReportOrderPdfUrlAction, {
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
          docketNumber,
        },
        form: {
          issueOrder: null,
        },
        statusReportOrder: {
          docketNumbersToDisplay: [docketNumber],
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
        docketNumber,
        documentTitle: 'Test Title',
        eventCode: '0',
      }),
    );
  });

  it('generates a pdf url for a lead case with all cases in group selected', async () => {
    const docketNumbers = ['1234-ABC', '2345-BCD', '3456-CDE'];
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getStatusReportOrderPdfUrlAction, {
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
          docketNumber: '1234-ABC',
        },
        form: {
          issueOrder: 'allCasesInGroup',
        },
        statusReportOrder: {
          docketNumbersToDisplay: docketNumbers,
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
        addedDocketNumbers: docketNumbers,
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        eventCode: '0',
      }),
    );
  });

  it('generates a pdf url for a lead case with just the lead case selected', async () => {
    const docketNumber = '1234-ABC';
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .createCourtIssuedOrderPdfFromHtmlInteractor.mockReturnValue(mockPdf);

    const result = await runAction(getStatusReportOrderPdfUrlAction, {
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
          docketNumber,
        },
        form: {
          issueOrder:
            STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
        },
        statusReportOrder: {
          docketNumbersToDisplay: [docketNumber],
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
        addedDocketNumbers: [],
        contentHtml: '<p>hi</p>',
        documentTitle: 'Test Title',
        eventCode: '0',
      }),
    );
  });
});
