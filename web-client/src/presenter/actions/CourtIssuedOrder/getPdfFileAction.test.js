import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPdfFileAction } from './getPdfFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPdfFileAction', () => {
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
      runAction(getPdfFileAction, {
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

    const result = await runAction(getPdfFileAction, {
      modules: {
        presenter,
      },
      props: { htmlString: '<p>hi</p>' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUtilities().formatDocketNumberWithSuffix,
    ).toBeCalled();
    expect(result.output.pdfUrl).toBe(mockPdf.url);
  });
});
