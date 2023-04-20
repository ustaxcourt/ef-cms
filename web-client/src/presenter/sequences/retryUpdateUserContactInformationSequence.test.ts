import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryUpdateUserContactInformationSequence } from './retryUpdateUserContactInformationSequence';

describe('retryUpdateUserContactInformationSequence', () => {
  let cerebralTest;

  let mockMessage = {
    originalRequest: {
      foo: 'bar',
    },
  };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      retryUpdateUserContactInformationSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the updateUserContactInformationInteractor with the information it received in the message', async () => {
    await cerebralTest.runSequence(
      'retryUpdateUserContactInformationSequence',
      mockMessage,
    );
    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor
        .mock.calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds before attempting to call the updateUserContactInformationInteractor', async () => {
    await cerebralTest.runSequence(
      'retryUpdateUserContactInformationSequence',
      mockMessage,
    );
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before attempting to call the updateUserContactInformationInteractor', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence(
      'retryUpdateUserContactInformationSequence',
      mockMessage,
    );
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
