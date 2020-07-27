import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseMessagesForCaseAction } from './getCaseMessagesForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseMessagesForCaseAction', () => {
  const mockCaseMessage = {
    createdAt: '2019-03-01T21:40:46.415Z',
    docketNumber: '101-20',
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
          docketNumber: '101-20',
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
      docketNumber: '101-20',
    });
    expect(result.state.caseDetail.messages).toEqual([mockCaseMessage]);
  });
});
