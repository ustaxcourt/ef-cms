const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  replyToCaseMessageInteractor,
} = require('./replyToCaseMessageInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { CASE_STATUS_TYPES, ROLES } = require('../../entities/EntityConstants');

describe('replyToCaseMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      replyToCaseMessageInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates the case message reply and marks the parent message as replied to', async () => {
    const caseMessageData = {
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
        },
      ],
      caseId: '7a130321-0a76-43bc-b3eb-64a18f07987d',
      message: "How's it going?",
      parentMessageId: '62ea7e6e-8101-4e4b-9bbd-932b149c86c3',
      subject: 'Hey!',
      toSection: 'petitions',
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        section: 'petitions',
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      })
      .mockReturnValueOnce({
        name: 'Test Petitionsclerk2',
        role: ROLES.petitionsClerk,
        section: 'petitions',
        userId: 'd90c8a79-9628-4ca9-97c6-02a161a02904',
      });

    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      caseCaption: 'Guy Fieri, Petitioner',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      status: CASE_STATUS_TYPES.generalDocket,
    });

    await replyToCaseMessageInteractor({
      applicationContext,
      ...caseMessageData,
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().createCaseMessage.mock
        .calls[0][0].caseMessage,
    ).toMatchObject({
      ...caseMessageData,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Guy Fieri',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'Test Petitionsclerk',
      fromSection: 'petitions',
      fromUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      to: 'Test Petitionsclerk2',
    });
    expect(
      applicationContext.getPersistenceGateway().markCaseMessageThreadRepliedTo,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().markCaseMessageThreadRepliedTo
        .mock.calls[0][0],
    ).toMatchObject({
      parentMessageId: caseMessageData.parentMessageId,
    });
  });
});
