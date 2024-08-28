import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeMessageInteractor } from './completeMessageInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('completeMessageInteractor', () => {
  const mockMessages = [
    {
      caseStatus: CASE_STATUS_TYPES.new,
      caseTitle: 'Test Petitioner',
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'gg',
      fromSection: PETITIONS_SECTION,
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world',
      messageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      parentMessageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      subject: 'hey!',
      to: 'bob',
      toSection: PETITIONS_SECTION,
      toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      caseStatus: CASE_STATUS_TYPES.new,
      caseTitle: 'Test Petitioner',
      createdAt: '2019-01-04T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'gg',
      fromSection: PETITIONS_SECTION,
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world2',
      messageId: 'ee84c7d5-31db-40dc-b1cc-7913be7138e8',
      parentMessageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'message|ee84c7d5-31db-40dc-b1cc-7913be7138e8',
      subject: 'hey!',
      to: 'bob',
      toSection: PETITIONS_SECTION,
      toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ];
  const PARENT_MESSAGE_ID_1 = 'b8ff88da-89fe-46a6-bc37-dc2100c7b2bd';
  const PARENT_MESSAGE_ID_2 = '4782edfe-618b-4315-9619-675403246bce';

  beforeAll(() => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue(mockMessages);
    applicationContext
      .getPersistenceGateway()
      .updateMessage.mockResolvedValue(mockMessages[1]);
    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockResolvedValue();
  });

  it('should throw unauthorized for a user without MESSAGES permission', async () => {
    await expect(
      completeMessageInteractor(
        applicationContext,
        {
          messages: [{ messageBody: 'hi', parentMessageId: '123' }],
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call persistence methods to mark the thread as replied to and complete the most recent messages', async () => {
    await completeMessageInteractor(
      applicationContext,
      {
        messages: [
          {
            messageBody: 'the completed message',
            parentMessageId: PARENT_MESSAGE_ID_1,
          },
          { messageBody: 'hi', parentMessageId: PARENT_MESSAGE_ID_2 },
        ],
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().markMessageThreadRepliedTo,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().markMessageThreadRepliedTo.mock
        .calls[0][0].parentMessageId,
    ).toEqual(PARENT_MESSAGE_ID_1);
    expect(
      applicationContext.getPersistenceGateway().markMessageThreadRepliedTo.mock
        .calls[1][0].parentMessageId,
    ).toEqual(PARENT_MESSAGE_ID_2);
    expect(
      applicationContext.getPersistenceGateway().updateMessage,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().updateMessage.mock.calls[0][0]
        .message,
    ).toMatchObject({
      completedBy: 'Test Petitionsclerk',
      completedBySection: PETITIONS_SECTION,
      completedByUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      isCompleted: true,
    });
    expect(
      applicationContext.getPersistenceGateway().updateMessage.mock.calls[1][0]
        .message,
    ).toMatchObject({
      completedBy: 'Test Petitionsclerk',
      completedBySection: PETITIONS_SECTION,
      completedByUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      isCompleted: true,
    });
  });

  it('should send a success message to the user', async () => {
    await completeMessageInteractor(
      applicationContext,
      {
        messages: [
          {
            messageBody: 'the completed message',
            parentMessageId: PARENT_MESSAGE_ID_1,
          },
        ],
      },
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toEqual({
      action: 'message_completion_success',
      completedMessageIds: [mockMessages[1].messageId],
    });
  });

  it('should send an error message to the user', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateMessage.mockRejectedValueOnce(new Error('Bad!'));
    await completeMessageInteractor(
      applicationContext,
      {
        messages: [
          {
            messageBody: 'the completed message',
            parentMessageId: PARENT_MESSAGE_ID_1,
          },
        ],
      },
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toEqual({
      action: 'message_completion_error',
      alertError: {
        message: 'Please try again',
        title: 'Message(s) could not be completed',
      },
    });
  });
});
