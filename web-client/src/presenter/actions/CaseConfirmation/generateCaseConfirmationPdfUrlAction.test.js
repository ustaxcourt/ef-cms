import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateCaseConfirmationPdfUrlAction } from './generateCaseConfirmationPdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateCaseConfirmationPdfUrlAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'http://www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('creates a pdf and returns an object URL', async () => {
    const result = await runAction(generateCaseConfirmationPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://www.example.com',
        caseDetail: {
          caseId: 'ca123',
          docketNumber: '123-45',
        },
        token: 'abcdefg',
      },
    });

    expect(result.state.pdfPreviewUrl).toEqual('http://www.example.com');
  });
});
