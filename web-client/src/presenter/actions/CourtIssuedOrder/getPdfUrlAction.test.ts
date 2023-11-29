import { ConsolidatedCasesWithCheckboxInfoType } from '@web-client/presenter/actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPdfUrlAction } from './getPdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPdfUrlAction', () => {
  let createObjectURLStub;

  const consolidatedCasesToMultiDocketOn: ConsolidatedCasesWithCheckboxInfoType[] =
    [
      {
        checkboxDisabled: false,
        checked: true,
        docketNumber: '101-20',
        docketNumberWithSuffix: '101-20',
        formattedPetitioners: 'Petitioner 1, Petitioner2',
        leadDocketNumber: '101-20',
      },
      {
        checkboxDisabled: false,
        checked: true,
        docketNumber: '102-20',
        docketNumberWithSuffix: '102-20',
        formattedPetitioners: 'Petitioner 1, Petitioner2',
        leadDocketNumber: '101-20',
      },
      {
        checkboxDisabled: false,
        checked: false,
        docketNumber: '105-20',
        docketNumberWithSuffix: '105-20',
        formattedPetitioners: 'Petitioner 1, Petitioner2',
        leadDocketNumber: '101-20',
      },
    ];
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
        signatureText: 'Test Signature',
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
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
        signatureText: 'Test Signature',
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
        signatureText: 'Test Signature',
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
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
        signatureText: 'Test Signature',
      }),
    );
  });
});
