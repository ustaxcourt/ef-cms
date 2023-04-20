import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryUpdateTrialSessionSequence } from './retryUpdateTrialSessionSequence';

describe('retryUpdateTrialSessionSequence', () => {
  let cerebralTest;

  let mockMessage = {
    originalRequest: {
      foo: 'bar',
      isSavingForLater: false,
    },
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      retryUpdateTrialSessionSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the updateTrialSessionInteractor with the information it received in the message', async () => {
    await cerebralTest.runSequence('retryUpdateTrialSessionSequence', {
      ...mockMessage,
    });
    expect(
      applicationContext.getUseCases().updateTrialSessionInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds by default', async () => {
    await cerebralTest.runSequence('retryUpdateTrialSessionSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence('retryUpdateTrialSessionSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
