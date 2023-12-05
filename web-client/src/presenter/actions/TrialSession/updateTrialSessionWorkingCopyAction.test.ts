import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateTrialSessionWorkingCopyAction } from './updateTrialSessionWorkingCopyAction';

describe('updateTrialSessionWorkingCopyAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the trial session working copy', async () => {
    applicationContext
      .getUseCases()
      .updateTrialSessionWorkingCopyInteractor.mockResolvedValue({
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '123',
        userId: '234',
      });

    await runAction(updateTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          sort: 'practitioner',
          sortOrder: 'desc',
          trialSessionId: '123',
          userId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateTrialSessionWorkingCopyInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().updateTrialSessionWorkingCopyInteractor
        .mock.calls[0][1].trialSessionWorkingCopyToUpdate.trialSessionId,
    ).toEqual('123');
  });
});
