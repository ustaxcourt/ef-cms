import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createPaperServicePdfForCasesAction } from './createPaperServicePdfForCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createPaperServicePdfForCasesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return appropriate paper service information', async () => {
    const paperServiceInfo = {
      docketEntryId: '2c4998ed-d86b-4030-9ec3-5952199b6bee',
      hasPaper: true,
      pdfUrl: 'www.example.com',
    };
    applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor.mockResolvedValue(
        paperServiceInfo,
      );
    const trialNoticePdfsKeys = ['382-830-29'];

    const result = await runAction(createPaperServicePdfForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialNoticePdfsKeys,
      },
    });

    expect(result.output).toEqual(paperServiceInfo);
    expect(
      applicationContext.getUseCases()
        .generateTrialSessionPaperServicePdfInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { trialNoticePdfsKeys });
  });
});
