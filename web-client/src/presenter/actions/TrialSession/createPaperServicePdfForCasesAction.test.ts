import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createPaperServicePdfForCasesAction } from './createPaperServicePdfForCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createPaperServicePdfForCasesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should make a call to combine the paper service documents for the cases on the trial session that have requested paper service', async () => {
    const mockTrialNoticePdfsKeys = ['382-23', '983-23'];
    const mockTrialSessionId = '23c5cf9b-d60a-4ddc-b173-62ffbfc3bbfc';

    await runAction(createPaperServicePdfForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialNoticePdfsKeys: mockTrialNoticePdfsKeys,
        trialSessionId: mockTrialSessionId,
      },
    });

    expect(
      applicationContext.getUseCases()
        .generateTrialSessionPaperServicePdfInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      trialNoticePdfsKeys: mockTrialNoticePdfsKeys,
      trialSessionId: mockTrialSessionId,
    });
  });
});
