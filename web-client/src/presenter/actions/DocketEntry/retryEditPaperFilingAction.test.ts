import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { retryEditPaperFilingAction } from './retryEditPaperFilingAction';
import { runAction } from 'cerebral/test';

describe('retryEditPaperFilingAction', () => {
  // this should receive an object to retry
  presenter.providers.applicationContext = applicationContext;
  let mockCall;
  const mockOriginalRequest = {
    clientConnectionId: 'abc123',
    consolidatedGroupDocketNumbers: ['222-22', '333-33'],
    docketEntryId: 'abc123',
    documentMetadata: {
      docketNumber: '111-11',
    },
    isSavingForLater: false,
  };

  beforeEach(() => {
    mockCall = {
      modules: {
        presenter,
      },
      props: {
        originalRequest: mockOriginalRequest,
      },
      state: {
        form: {},
      },
    };
  });

  it('should call the editPaperFilingInteractor with the originalRequest that it received', async () => {
    await runAction(retryEditPaperFilingAction, mockCall);
    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  it('should wait a default of 3 seconds before calling editPaperFilingInteractor', async () => {
    await runAction(retryEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        originalRequest: mockOriginalRequest,
      },
      state: {
        form: {},
      },
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before calling editPaperFilingInteractor', async () => {
    await runAction(retryEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        mockOriginalRequest,
        retryAfter: 5000,
      },
      state: {
        form: {},
      },
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
