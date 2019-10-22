import { generateCaseConfirmationPdfUrlAction } from './generateCaseConfirmationPdfUrlAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generateCaseConfirmationPdfUrlAction', () => {
  it('creates a pdf and returns an object URL', async () => {
    const result = await runAction(generateCaseConfirmationPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://www.demo.com',
        caseDetail: {
          caseId: 'ca123',
          docketNumber: '123-45',
        },
        token: 'abcdefg',
      },
    });

    const expectedUrl =
      'http://www.demo.com/documents/case-123-45-confirmation.pdf/document-download-url?token=abcdefg';
    expect(result.state.pdfPreviewUrl).toEqual(expectedUrl);
  });
});
