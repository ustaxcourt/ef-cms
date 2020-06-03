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

  it('throws error if htmlString is empty', async () => {
    await expect(
      runAction(getPdfUrlAction, {
        props: { htmlString: '' },
        state: {},
      }),
    ).rejects.toThrow();
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
      props: { htmlString: '<p>hi</p>' },
      state: { caseDetail: {} },
    });

    expect(
      applicationContextForClient.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toBeCalled();
    expect(result.output.pdfUrl).toBe(mockPdf.url);
  });
});
