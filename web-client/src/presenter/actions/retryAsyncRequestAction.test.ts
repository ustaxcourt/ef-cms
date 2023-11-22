import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryAsyncRequestAction } from './retryAsyncRequestAction';
import { runAction } from 'cerebral/test';

describe('retryAsyncRequestAction', () => {
  // this should receive an object to retry
  presenter.providers.applicationContext = applicationContext;
  let mockCall;
  const mockOriginalRequest = {
    foo: 'bar',
  };

  beforeEach(() => {
    mockCall = {
      modules: {
        presenter,
      },
      props: {
        originalRequest: mockOriginalRequest,
        requestToRetry: 'file_and_serve_court_issued_document',
      },
      state: {
        form: {},
      },
    };
  });

  it('should call the the interactor for the requestToRetry with the originalRequest that it received', async () => {
    mockCall.props.requestToRetry = 'file_and_serve_court_issued_document';

    await runAction(retryAsyncRequestAction, mockCall);
    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });
});
