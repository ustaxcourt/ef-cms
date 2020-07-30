import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePublicDocketRecordPdfUrlAction } from './generatePublicDocketRecordPdfUrlAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('generatePublicDocketRecordPdfUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('generates a public docket record pdf url', async () => {
    const mockPdf = { url: 'www.example.com' };
    applicationContext
      .getUseCases()
      .generatePublicDocketRecordPdfInteractor.mockReturnValue(mockPdf);

    const result = await runAction(generatePublicDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(result.output).toMatchObject({
      pdfUrl: mockPdf.url,
    });
    expect(
      applicationContext.getUseCases().generatePublicDocketRecordPdfInteractor,
    ).toBeCalled();
  });
});
