import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearPdfPreviewUrlAction } from './clearPdfPreviewUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPdfPreviewUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should unset state.pdfPreviewUrl', async () => {
    const result = await runAction(clearPdfPreviewUrlAction, {
      modules: {
        presenter,
      },
      state: {
        pdfPreviewUrl: 'www.example.com',
      },
    });

    expect(result.state.pdfPreviewUrl).toBeUndefined();
  });
});
