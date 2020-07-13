import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseMessagesForCaseAction } from './getCaseMessagesForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseMessagesForCaseAction', () => {
  const mockCaseMessage = {
    caseId: 'b3f09a45-b27c-4383-acc1-2ab1f99e6725',
    createdAt: '2019-03-01T21:40:46.415Z',
    from: 'Test Petitionsclerk',
    fromSection: 'petitions',
    fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
    message: 'hey there',
    messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
    subject: 'hello',
    to: 'Test Petitionsclerk2',
    toSection: 'petitions',
    toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
    applicationContextForClient
      .getUseCases()
      .getCaseMessagesForCaseInteractor.mockReturnValue([mockCaseMessage]);
  });

  it('calls the use case with caseId', async () => {
    const result = await runAction(getCaseMessagesForCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .getCaseMessagesForCaseInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().getCaseMessagesForCaseInteractor
        .mock.calls[0][0],
    ).toMatchObject({
      caseId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
    });
    expect(result.state.caseDetail.messages).toEqual([mockCaseMessage]);
  });
});
