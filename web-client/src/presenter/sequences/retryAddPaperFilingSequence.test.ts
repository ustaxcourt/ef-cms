import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryAddPaperFilingSequence } from './retryAddPaperFilingSequence';

describe('retryAddPaperFilingSequence', () => {
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
      retryAddPaperFilingSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the addPaperFilingInteractor with the information it received in the message', async () => {
    await cerebralTest.runSequence('retryAddPaperFilingSequence', {
      ...mockMessage,
    });
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds before attempting to call the addPaperFilingInteractor', async () => {
    await cerebralTest.runSequence('retryAddPaperFilingSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before attempting to call the addPaperFilingInteractor', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence('retryAddPaperFilingSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
