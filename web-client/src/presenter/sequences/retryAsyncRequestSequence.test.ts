import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryAsyncRequestSequence } from './retryAsyncRequestSequence';

describe('retryAsyncRequestSequence', () => {
  let cerebralTest;
  let mockMessage = {
    originalRequest: {
      foo: 'bar',
    },
    requestToRetry: 'file_and_serve_court_issued_document',
  };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      retryAsyncRequestSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should call the interactor for the requestToRetry', async () => {
    await cerebralTest.runSequence('retryAsyncRequestSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject(mockMessage.originalRequest);
  });

  it('should wait 3 seconds by default', async () => {
    await cerebralTest.runSequence('retryAsyncRequestSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time', async () => {
    mockMessage.retryAfter = 5000;
    await cerebralTest.runSequence('retryAsyncRequestSequence', {
      ...mockMessage,
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
