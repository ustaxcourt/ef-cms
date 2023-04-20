import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retrySetNoticesForCalendaredTrialSessionSequence } from './retrySetNoticesForCalendaredTrialSessionSequence';

describe('retrySetNoticesForCalendaredTrialSessionSequence', () => {
  let cerebralTest;

  let mockMessage = {
    originalRequest: {
      clientConnectionId: 'abc123',
      consolidatedGroupDocketNumbers: ['222-22', '333-33'],
      docketEntryId: 'abc123',
      documentMetadata: {
        docketNumber: '111-11',
      },
      isSavingForLater: false,
    },
  };
  beforeAll(() => {
    applicationContext.getUseCases().setNoticesForCalendaredTrialSessionInteractor =
      jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      retrySetNoticesForCalendaredTrialSessionSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the setNoticesForCalendaredTrialSessionInteractor with the information it received in the message', async () => {
    await cerebralTest.runSequence(
      'retrySetNoticesForCalendaredTrialSessionSequence',
      {
        ...mockMessage,
      },
    );
    expect(
      applicationContext.getUseCases()
        .setNoticesForCalendaredTrialSessionInteractor.mock.calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds before attempting to call the setNoticesForCalendaredTrialSessionInteractor', async () => {
    await cerebralTest.runSequence(
      'retrySetNoticesForCalendaredTrialSessionSequence',
      {
        ...mockMessage,
      },
    );
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before attempting to call the setNoticesForCalendaredTrialSessionInteractor', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence(
      'retrySetNoticesForCalendaredTrialSessionSequence',
      {
        ...mockMessage,
      },
    );
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
