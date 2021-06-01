import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionWorkingCopyAction } from './getTrialSessionWorkingCopyAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionWorkingCopyAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the trial session working copy', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionWorkingCopyInteractor.mockResolvedValue({
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '123',
        userId: '234',
      });

    await runAction(getTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().getTrialSessionWorkingCopyInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getTrialSessionWorkingCopyInteractor.mock
        .calls[0][1].trialSessionId,
    ).toEqual('123');
  });
});
