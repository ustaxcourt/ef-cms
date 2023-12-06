import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openSelectedTrialSessionPaperServicePdfAction } from './openSelectedTrialSessionPaperServicePdfAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openSelectedTrialSessionPaperServicePdfsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should generate the selected trial session paper pdfs and open new tabs', async () => {
    const fileId = 'b29d80c1-1f58-49db-9cc9-73d441c0622f';
    applicationContext
      .getUseCases()
      .getPaperServicePdfUrlInteractor.mockResolvedValue({
        url: 'www.google.com',
      });
    applicationContext
      .getUtilities()
      .openUrlInNewTab.mockResolvedValue(undefined);

    await runAction(openSelectedTrialSessionPaperServicePdfAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPdf: fileId,
      },
    });

    expect(
      applicationContext.getUseCases().getPaperServicePdfUrlInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { fileId });
    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: 'www.google.com' });
  });
});
