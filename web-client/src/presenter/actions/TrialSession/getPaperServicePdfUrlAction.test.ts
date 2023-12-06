import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPaperServicePdfUrlAction } from '@web-client/presenter/actions/TrialSession/getPaperServicePdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPaperServicePdfUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should get the paper service pdf url', async () => {
    const fileId = '011fa840-2c07-4069-9d71-fb874b5abdcb';
    const mockPdfUrl = 'www.hola.com';
    applicationContext
      .getUseCases()
      .getPaperServicePdfUrlInteractor.mockResolvedValue({
        url: mockPdfUrl,
      });

    const result = await runAction(getPaperServicePdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        fileId,
      },
    });

    expect(
      applicationContext.getUseCases().getPaperServicePdfUrlInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { fileId });
    expect(result.output).toEqual({ pdfUrl: mockPdfUrl });
  });
});
