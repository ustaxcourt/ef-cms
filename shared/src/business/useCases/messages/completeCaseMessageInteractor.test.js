const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  completeCaseMessageInteractor,
} = require('./completeCaseMessageInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { ROLES } = require('../../entities/EntityConstants');

describe('completeCaseMessageInteractor', () => {
  const mockCaseMessages = [
    {
      caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      caseStatus: 'New',
      caseTitle: 'Test Petitioner',
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'gg',
      fromSection: 'petitions',
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world',
      messageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      parentMessageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      subject: 'hey!',
      to: 'bob',
      toSection: 'petitions',
      toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      caseStatus: 'New',
      caseTitle: 'Test Petitioner',
      createdAt: '2019-01-04T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'gg',
      fromSection: 'petitions',
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world2',
      messageId: 'ee84c7d5-31db-40dc-b1cc-7913be7138e8',
      parentMessageId: '829e790e-3c22-4308-9267-a251c0d4ce77',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'message|ee84c7d5-31db-40dc-b1cc-7913be7138e8',
      subject: 'hey!',
      to: 'bob',
      toSection: 'petitions',
      toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ];

  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      completeCaseMessageInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls persistence methods to mark the thread as replied to and complete the most recent message', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: 'petitions',
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseMessageThreadByParentId.mockReturnValue(mockCaseMessages);
    applicationContext
      .getPersistenceGateway()
      .updateCaseMessage.mockResolvedValue(mockCaseMessages[1]);

    const PARENT_MESSAGE_ID = 'b8ff88da-89fe-46a6-bc37-dc2100c7b2bd';

    await completeCaseMessageInteractor({
      applicationContext,
      message: 'the completed message',
      parentMessageId: PARENT_MESSAGE_ID,
    });

    expect(
      applicationContext.getPersistenceGateway().markCaseMessageThreadRepliedTo,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().markCaseMessageThreadRepliedTo
        .mock.calls[0][0].parentMessageId,
    ).toEqual(PARENT_MESSAGE_ID);
    expect(
      applicationContext.getPersistenceGateway().updateCaseMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseMessage.mock
        .calls[0][0].caseMessage,
    ).toMatchObject({
      completedBy: 'Test Petitionsclerk',
      completedBySection: 'petitions',
      completedByUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      isCompleted: true,
    });
  });
});
