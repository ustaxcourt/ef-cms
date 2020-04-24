import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPdfFromUrlAction } from './getPdfFromUrlAction';
import { runAction } from 'cerebral/test';

describe('getPdfFromUrlAction', () => {
  it('should get the pdf from the provided url', async () => {
    const mockPdfUrl = 'www.example.com';
    const mockFile = {
      name: 'mockfile.pdf',
    };
    applicationContext
      .getUseCases()
      .getPdfFromUrlInteractor.mockReturnValue(mockFile);

    const result = await runAction(getPdfFromUrlAction, {
      props: {
        pdfUrl: mockPdfUrl,
      },
    });

    expect(result).toMatchObject(mockFile);
    expect(
      applicationContext.getUseCases().getPdfFromUrlInteractor,
    ).toBeCalled();
  });
});
