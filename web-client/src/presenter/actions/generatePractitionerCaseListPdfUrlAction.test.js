import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { generatePractitionerCaseListPdfUrlAction } from './generatePractitionerCaseListPdfUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePractitionerCaseListPdfUrlAction', () => {
  const url = 'http://www.example.com/some-pdf-url';
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .generatePractitionerCaseListPdfInteractor.mockReturnValue({ url });
  });

  it('generates a PDF from provided scan batches', async () => {
    const userId = 'abc-123-do-re-mi';
    const { output } = await runAction(
      generatePractitionerCaseListPdfUrlAction,
      {
        modules: {
          presenter,
        },
        props: {
          userId,
        },
        state: {},
      },
    );

    expect(output).toEqual({ pdfUrl: url });

    expect(
      applicationContext.getUseCases()
        .generatePractitionerCaseListPdfInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { userId });
  });
});
