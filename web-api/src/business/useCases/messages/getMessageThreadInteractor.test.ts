import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getMessageThreadInteractor } from './getMessageThreadInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getMessageThreadInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    await expect(
      getMessageThreadInteractor(
        applicationContext,
        {
          parentMessageId: 'abc',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('retrieves the message thread from persistence and returns it', async () => {
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
    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([mockMessage]);

    const returnedMessage = await getMessageThreadInteractor(
      applicationContext,
      {
        parentMessageId: 'abc',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getMessageThreadByParentId,
    ).toHaveBeenCalled();
    expect(returnedMessage).toMatchObject([mockMessage]);
  });
});
