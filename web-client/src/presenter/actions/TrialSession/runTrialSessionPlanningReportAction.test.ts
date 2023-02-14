import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { runTrialSessionPlanningReportAction } from './runTrialSessionPlanningReportAction';

describe('runTrialSessionPlanningReportAction', () => {
  beforeAll(() => {
    const mockPdfUrl = 'www.example.com';

    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .runTrialSessionPlanningReportInteractor.mockResolvedValue(mockPdfUrl);
  });
  it('returns a url to the newly created report pdf', async () => {
    const result = await runAction(runTrialSessionPlanningReportAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: 'winter',
          year: '2020',
        },
      },
    });
    expect(
      applicationContext.getUseCases().runTrialSessionPlanningReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toHaveProperty('pdfUrl');
  });
});
