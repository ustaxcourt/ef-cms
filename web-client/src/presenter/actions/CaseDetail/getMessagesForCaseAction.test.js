import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getMessagesForCaseAction } from './getMessagesForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getMessagesForCaseAction', () => {
  const { PETITIONS_SECTION } = applicationContextForClient.getConstants();
  const mockMessage = {
    createdAt: '2019-03-01T21:40:46.415Z',
    docketNumber: '101-20',
    from: 'Test Petitionsclerk',
    fromSection: PETITIONS_SECTION,
    fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
    message: 'hey there',
    messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
    subject: 'hello',
    to: 'Test Petitionsclerk2',
    toSection: PETITIONS_SECTION,
    toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
    applicationContextForClient
      .getUseCases()
      .getMessagesForCaseInteractor.mockReturnValue([mockMessage]);
  });

  it('calls the use case with docketNumber', async () => {
    const result = await runAction(getMessagesForCaseAction, {
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
      applicationContextForClient.getUseCases().getMessagesForCaseInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().getMessagesForCaseInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      docketNumber: '101-20',
    });
    expect(result.state.caseDetail.messages).toEqual([mockMessage]);
  });
});
