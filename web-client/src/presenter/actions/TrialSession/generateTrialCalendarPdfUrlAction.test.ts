import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTrialCalendarPdfUrlAction } from './generateTrialCalendarPdfUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateTrialCalendarPdfUrlAction', () => {
  const mockPdfUrl = { url: 'www.example.com' };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .generateTrialCalendarPdfInteractor.mockResolvedValue(mockPdfUrl);
  });

  it('returns the trial calendar pdf url', async () => {
    const result = await runAction(generateTrialCalendarPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: 'trial-session-id-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateTrialCalendarPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toMatchObject({
      pdfUrl: mockPdfUrl.url,
    });
  });
});
