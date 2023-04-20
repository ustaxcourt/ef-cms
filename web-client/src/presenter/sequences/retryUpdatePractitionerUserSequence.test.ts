import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryUpdatePractitionerUserSequence } from './retryUpdatePractitionerUserSequence';

describe('retryUpdatePractitionerUserSequence', () => {
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
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      retryUpdatePractitionerUserSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the updatePractitionerUserInteractor with the information it received in the message', async () => {
    await cerebralTest.runSequence('retryUpdatePractitionerUserSequence', {
      ...mockMessage,
    });
    expect(
      applicationContext.getUseCases().updatePractitionerUserInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds by default', async () => {
    await cerebralTest.runSequence('retryUpdatePractitionerUserSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence('retryUpdatePractitionerUserSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
