import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPdfFromUrlAction } from './getPdfFromUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPdfFromUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should get the pdf from the provided url', async () => {
    const mockPdfUrl = 'www.example.com';
    const mockFile = {
      name: 'mockfile.pdf',
    };
    applicationContext
      .getUseCases()
      .getPdfFromUrlInteractor.mockReturnValue(mockFile);

    const result = await runAction(getPdfFromUrlAction, {
      modules: {
        presenter,
      },
      props: {
        pdfUrl: mockPdfUrl,
      },
    });

    expect(result.output).toMatchObject(mockFile);
    expect(
      applicationContext.getUseCases().getPdfFromUrlInteractor,
    ).toHaveBeenCalled();
  });
});
