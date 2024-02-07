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

    await runAction(retryAsyncRequestAction as any, mockCall);
    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  [
    ['add_paper_filing', 'addPaperFilingInteractor'],
    ['edit_paper_filing', 'editPaperFilingInteractor'],
    [
      'file_and_serve_court_issued_document',
      'fileAndServeCourtIssuedDocumentInteractor',
    ],
    [
      'set_notices_for_calendared_trial_session',
      'setNoticesForCalendaredTrialSessionInteractor',
    ],
    ['update_practitioner_user', 'updatePractitionerUserInteractor'],
    ['update_trial_session', 'updateTrialSessionInteractor'],
    [
      'update_user_contact_information',
      'updateUserContactInformationInteractor',
    ],
    ['verify_user_pending_email', 'verifyUserPendingEmailInteractor'],
  ].forEach(([key, method]) => {
    it(`should call "${method}" when the key is "${key}"`, async () => {
      mockCall.props.requestToRetry = key;
      applicationContext.getUseCases()[method] = jest.fn();

      await runAction(retryAsyncRequestAction as any, mockCall);

      expect(
        applicationContext.getUseCases()[method].mock.calls[0][1],
      ).toMatchObject(mockOriginalRequest);
    });
  });
});
