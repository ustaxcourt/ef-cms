import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getMessagesForCaseInteractor } from './getMessagesForCaseInteractor';

describe('getMessagesForCaseInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      getMessagesForCaseInteractor(applicationContext, {
        docketNumber: '101-20',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the messages from persistence and returns them', async () => {
    const mockMessage = {
      attachments: [],
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Bill Burr',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      entityName: 'Message',
      from: 'Test Petitionsclerk2',
      fromSection: PETITIONS_SECTION,
      fromUserId: 'fe6eeadd-e4e8-4e56-9ddf-0ebe9516df6b',
      isRepliedTo: false,
      message: "How's it going?",
      messageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      parentMessageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
      subject: 'Hey!',
      to: 'Test Petitionsclerk',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getMessagesByDocketNumber.mockReturnValue([mockMessage]);

    const returnedMessage = await getMessagesForCaseInteractor(
      applicationContext,
      {
        docketNumber: mockMessage.docketNumber,
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getMessagesByDocketNumber,
    ).toHaveBeenCalled();
    expect(returnedMessage).toMatchObject([mockMessage]);
  });
});
