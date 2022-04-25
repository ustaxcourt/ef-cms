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

  it('returns a link to the NOTR when no docket entry exists with the NOTR (old confirmation.pdf approach)', async () => {
    const result = await runAction(generateCaseConfirmationPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [],
          docketNumber: '123-45',
        },
        token: 'abcdefg',
      },
    });

    expect(result.state.pdfPreviewUrl).toEqual('http://www.example.com');
  });

  it('returns a link to the NOTR when a NOTR docket entry exists on the case', async () => {
    const result = await runAction(generateCaseConfirmationPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
              eventCode: 'NOTR',
            },
          ],
          docketNumber: '123-45',
        },
        token: 'abcdefg',
      },
    });

    expect(result.state.pdfPreviewUrl).toEqual('http://www.example.com');
  });
});
